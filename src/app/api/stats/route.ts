import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    // Query analysis records for current user (or global guest records if guest)
    const records = await db.analysisRecord.findMany({
      where: user ? { userId: user.id } : {},
      select: {
        id: true,
        riskLevel: true,
        riskScore: true,
        category: true,
        inputType: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalAnalyses = records.length;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let uncertainCount = 0;

    const categoryBreakdown: Record<string, number> = {};
    const inputTypeBreakdown: Record<string, number> = {};

    for (const rec of records) {
      if (rec.riskLevel === 'HIGH') highRiskCount++;
      else if (rec.riskLevel === 'MEDIUM') mediumRiskCount++;
      else if (rec.riskLevel === 'LOW') lowRiskCount++;
      else uncertainCount++;

      categoryBreakdown[rec.category] = (categoryBreakdown[rec.category] || 0) + 1;
      inputTypeBreakdown[rec.inputType] = (inputTypeBreakdown[rec.inputType] || 0) + 1;
    }

    // Format category distribution
    const categories = Object.entries(categoryBreakdown).map(([name, count]) => ({
      name,
      count,
      percentage: totalAnalyses > 0 ? Math.round((count / totalAnalyses) * 100) : 0,
    }));

    // Format input type distribution
    const inputTypes = Object.entries(inputTypeBreakdown).map(([type, count]) => ({
      type,
      count,
    }));

    const averageRiskScore =
      totalAnalyses > 0
        ? Math.round(records.reduce((acc, curr) => acc + curr.riskScore, 0) / totalAnalyses)
        : 0;

    return NextResponse.json({
      totalAnalyses,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      uncertainCount,
      averageRiskScore,
      categories,
      inputTypes,
      hasData: totalAnalyses > 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to calculate stats.', details: error?.message }, { status: 500 });
  }
}
