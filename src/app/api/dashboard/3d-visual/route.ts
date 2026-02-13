import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get anomaly distribution by type
    const anomalies = await db.anomalyLog.groupBy({
      by: ['type'],
      where: { resolved: false },
      _count: true,
    })

    // Get knowledge entries by type
    const knowledgeByType = await db.knowledgeEntry.groupBy({
      by: ['type'],
      _count: true,
    })

    // Get query trends (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const queryTrends = await db.queryLog.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group queries by day
    const queriesByDay: Record<string, number> = {}
    queryTrends.forEach(q => {
      const day = q.createdAt.toISOString().split('T')[0]
      queriesByDay[day] = (queriesByDay[day] || 0) + 1
    })

    // Get encryption operations over time
    const encryptionTrends = await db.encryptionLog.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const encryptionByDay: Record<string, { encrypt: number; decrypt: number }> = {}
    encryptionTrends.forEach(e => {
      const day = e.createdAt.toISOString().split('T')[0]
      if (!encryptionByDay[day]) {
        encryptionByDay[day] = { encrypt: 0, decrypt: 0 }
      }
      encryptionByDay[day][e.operation as 'encrypt' | 'decrypt']++
    })

    // Generate 3D visualization data points
    const visualData = {
      anomalies: anomalies.map(a => ({
        type: a.type,
        count: a._count,
        color: a.type === 'critical' ? '#ef4444' : a.type === 'warning' ? '#f59e0b' : '#3b82f6',
      })),
      knowledge: knowledgeByType.map(k => ({
        type: k.type,
        count: k._count,
        color: '#8b5cf6',
      })),
      queryTrends: Object.entries(queriesByDay).map(([date, count]) => ({
        date,
        count,
      })),
      encryptionTrends: Object.entries(encryptionByDay).map(([date, ops]) => ({
        date,
        encrypt: ops.encrypt,
        decrypt: ops.decrypt,
      })),
      // 3D scatter plot data for anomalies
      anomalyScatter: await db.anomalyLog.findMany({
        where: { resolved: false },
        select: {
          id: true,
          type: true,
          severity: true,
          createdAt: true,
        },
        take: 50,
      }).map(a => ({
        x: a.severity,
        y: new Date(a.createdAt).getTime(),
        z: a.type === 'critical' ? 3 : a.type === 'warning' ? 2 : 1,
        type: a.type,
        id: a.id,
      })),
    }

    return NextResponse.json({
      success: true,
      data: visualData,
    })
  } catch (error) {
    console.error('3D visual data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch visualization data' },
      { status: 500 }
    )
  }
}
