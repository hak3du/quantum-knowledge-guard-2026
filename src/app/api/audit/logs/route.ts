import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await db.auditLog.count()

    return NextResponse.json({
      success: true,
      logs: logs.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.userId,
        resource: log.resource,
        details: log.details,
        ipAddress: log.ipAddress,
        timestamp: log.createdAt,
      })),
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Audit logs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
