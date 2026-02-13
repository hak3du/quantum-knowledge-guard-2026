import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, content, metadata, uploadedBy } = body

    // Create knowledge entry
    const entry = await db.knowledgeEntry.create({
      data: {
        title,
        type: type.toUpperCase(),
        status: 'processing',
        content,
        metadata,
        uploadedBy,
      },
    })

    // Simulate async processing (in production, this would be a background job)
    // For now, we'll mark it as indexed after creation
    await db.knowledgeEntry.update({
      where: { id: entry.id },
      data: { status: 'indexed' },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        action: 'KNOWLEDGE_INGEST',
        resource: `KnowledgeEntry:${entry.id}`,
        details: `Ingested ${type} file: ${title}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        title: entry.title,
        type: entry.type,
        status: 'indexed',
        createdAt: entry.createdAt,
      },
    })
  } catch (error) {
    console.error('Knowledge ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to ingest knowledge' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const entries = await db.knowledgeEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      entries: entries.map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        status: e.status,
        createdAt: e.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching knowledge entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch knowledge entries' },
      { status: 500 }
    )
  }
}
