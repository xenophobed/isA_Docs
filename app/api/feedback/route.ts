import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const FEEDBACK_FILE = process.env.FEEDBACK_FILE || path.join(process.cwd(), '.feedback.jsonl')

export async function POST(request: NextRequest) {
  try {
    const { page, rating, comment } = await request.json()

    if (!page || !rating || !['helpful', 'not-helpful'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 })
    }

    const entry = {
      page,
      rating,
      comment: comment?.slice(0, 1000) || '',
      timestamp: new Date().toISOString(),
    }

    await fs.appendFile(FEEDBACK_FILE, JSON.stringify(entry) + '\n')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ success: true }) // Don't fail the UX
  }
}
