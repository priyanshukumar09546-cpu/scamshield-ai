import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    // Query records for the authenticated user, or recent global records if guest
    const records = await db.analysisRecord.findMany({
      where: user ? { userId: user.id } : { userId: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        inputType: true,
        riskScore: true,
        riskLevel: true,
        confidence: true,
        category: true,
        explanation: true,
        createdAt: true,
        processingTimeMs: true,
      },
    });

    return NextResponse.json({
      records,
      isAuthenticated: Boolean(user),
      count: records.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch history.', details: error?.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    // Only delete records belonging to this user (or guest records if not logged in)
    const result = await db.analysisRecord.deleteMany({
      where: user ? { userId: user.id } : { userId: null },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} analysis record(s).`,
      count: result.count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to clear history.', details: error?.message }, { status: 500 });
  }
}
