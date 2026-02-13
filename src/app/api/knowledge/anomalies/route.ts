import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const anomalies = await db.anomalyLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      anomalies: anomalies.map(a => ({
        id: a.id,
        type: a.type,
        message: a.message,
        source: a.source,
        severity: a.severity,
        resolved: a.resolved,
        timestamp: a.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch anomalies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, source, severity } = body

    const anomaly = await db.anomalyLog.create({
      data: {
        type: type || 'info',
        message,
        source: source || 'System',
        severity: severity || 0,
      },
    })

    return NextResponse.json({
      success: true,
      anomaly: {
        id: anomaly.id,
        type: anomaly.type,
        message: anomaly.message,
        source: anomaly.source,
        timestamp: anomaly.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating anomaly:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create anomaly' },
      { status: 500 }
    )
  }
}
