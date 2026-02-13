import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get counts
    const knowledgeCount = await db.knowledgeEntry.count({
      where: { status: 'indexed' },
    })

    const activeAnomalies = await db.anomalyLog.count({
      where: { resolved: false },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const queriesToday = await db.queryLog.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    // Get recent anomalies
    const recentAnomalies = await db.anomalyLog.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get recent knowledge entries
    const recentEntries = await db.knowledgeEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get encryption stats
    const encryptionCount = await db.encryptionLog.count({
      where: { operation: 'encrypt' },
    })

    const avgEncryptionTime = await db.encryptionLog.aggregate({
      where: { operation: 'encrypt' },
      _avg: { processingTime: true },
    })

    return NextResponse.json({
      success: true,
      metrics: {
        knowledgeEntries: knowledgeCount,
        activeAnomalies,
        queriesToday,
        encryptionStatus: 'Active',
        encryptionOperations: encryptionCount,
        avgEncryptionTime: Math.round(avgEncryptionTime._avg.processingTime || 0),
      },
      recentAnomalies: recentAnomalies.map(a => ({
        id: a.id,
        type: a.type,
        message: a.message,
        source: a.source,
        timestamp: a.createdAt,
      })),
      recentEntries: recentEntries.map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        status: e.status,
        timestamp: e.createdAt,
      })),
    })
  } catch (error) {
    console.error('Dashboard overview error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
