import { NextRequest, NextResponse } from 'next/server'

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333'
const MODEL_URL = process.env.MODEL_URL || 'http://localhost:8082'
const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'isa_docs'

export async function POST(request: NextRequest) {
  try {
    const { query, top_k = 5 } = await request.json()

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], answer: null })
    }

    // Get embedding from model service
    const embeddingRes = await fetch(`${MODEL_URL}/api/v1/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input_data: [query],
        model: 'text-embedding-3-small',
        service_type: 'embedding',
        task: 'embed'
      })
    })

    const embeddingData = await embeddingRes.json()

    if (!embeddingData.success || !embeddingData.result?.embeddings?.[0]) {
      return NextResponse.json({
        results: [],
        answer: 'Search temporarily unavailable'
      })
    }

    const queryVector = embeddingData.result.embeddings[0]

    // Search Qdrant
    const searchRes = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: queryVector,
        limit: top_k * 2, // Get extra for deduplication
        with_payload: true
      })
    })

    const searchData = await searchRes.json()

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
    console.error('Search error:', error)
    return NextResponse.json({
      results: [],
      answer: 'Search error'
    }, { status: 500 })
  }
}
