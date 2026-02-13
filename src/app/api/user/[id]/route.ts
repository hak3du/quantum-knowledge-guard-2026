import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { role, status } = body

    const user = await db.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        action: 'USER_UPDATED',
        resource: `User:${user.id}`,
        details: `Updated user ${user.email}: ${role ? `role=${role}` : ''} ${status ? `status=${status}` : ''}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
