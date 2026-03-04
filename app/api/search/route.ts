import { NextRequest, NextResponse } from 'next/server'

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333'
const MODEL_URL = process.env.MODEL_URL || 'http://localhost:8082'
const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'isa_docs'
const EMBEDDING_MODEL = process.env.SEARCH_EMBEDDING_MODEL || 'text-embedding-3-small'
const RATE_LIMIT_MAX = parseInt(process.env.SEARCH_RATE_LIMIT || '30', 10)
const REQUEST_TIMEOUT_MS = parseInt(process.env.SEARCH_TIMEOUT_MS || '10000', 10)

// Simple in-memory rate limiter (per-IP, sliding window)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { results: [], answer: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const { query, top_k = 5 } = await request.json()

    if (!query || typeof query !== 'string' || query.length < 2 || query.length > 500) {
      return NextResponse.json({ results: [], answer: null })
    }

    // Get embedding from model service
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let embeddingData
    try {
      const embeddingRes = await fetch(`${MODEL_URL}/api/v1/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_data: [query],
          model: EMBEDDING_MODEL,
          service_type: 'embedding',
          task: 'embed'
        }),
        signal: controller.signal
      })
      embeddingData = await embeddingRes.json()
    } finally {
      clearTimeout(timeout)
    }

    if (!embeddingData.success || !embeddingData.result?.embeddings?.[0]) {
      return NextResponse.json({
        results: [],
        answer: 'Search temporarily unavailable'
      })
    }

    const queryVector = embeddingData.result.embeddings[0]

    // Search Qdrant
    const searchController = new AbortController()
    const searchTimeout = setTimeout(() => searchController.abort(), REQUEST_TIMEOUT_MS)

    let searchData
    try {
      const searchRes = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vector: queryVector,
          limit: top_k * 2, // Get extra for deduplication
          with_payload: true
        }),
        signal: searchController.signal
      })
      searchData = await searchRes.json()
    } finally {
      clearTimeout(searchTimeout)
    }

    // Format and deduplicate results
    const results: Array<{
      title: string
      description: string
      href: string
      category?: string
      score: number
    }> = []
    const seenHrefs = new Set<string>()

    for (const hit of searchData.result || []) {
      const href = hit.payload?.href || ''
      if (seenHrefs.has(href)) continue
      seenHrefs.add(href)

      results.push({
        title: hit.payload?.title || 'Untitled',
        description: (hit.payload?.text || '').slice(0, 150) + '...',
        href,
        category: hit.payload?.category,
        score: hit.score
      })

      if (results.length >= top_k) break
    }

    return NextResponse.json({
      results,
      answer: results.length > 0
        ? `Found ${results.length} relevant pages`
        : null
    })

  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json({
        results: [],
        answer: 'Search timed out. Please try again.'
      }, { status: 504 })
    }

    console.error('Search error:', error)
    return NextResponse.json({
      results: [],
      answer: 'Search error'
    }, { status: 500 })
  }
}
