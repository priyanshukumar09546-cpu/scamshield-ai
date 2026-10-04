import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = await db.analysisRecord.findUnique({
      where: { id: params.id },
      include: { signals: true },
    });

    if (!record) {
      return NextResponse.json({ error: 'Analysis record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      id: record.id,
      inputType: record.inputType,
      riskScore: record.riskScore,
      riskLevel: record.riskLevel,
      confidence: record.confidence,
      category: record.category,
      explanation: record.explanation,
      uncertainty: record.uncertainty,
      detectedRedFlags: JSON.parse(record.detectedRedFlags || '[]'),
      evidenceItems: JSON.parse(record.evidenceItems || '[]'),
      safeActions: JSON.parse(record.safeActions || '[]'),
      trustedSources: JSON.parse(record.trustedSources || '[]'),
      threatIntelSummary: JSON.parse(record.threatIntelStatus || '{}'),
      signals: record.signals,
      processingTimeMs: record.processingTimeMs,
      createdAt: record.createdAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve analysis.', details: error?.message }, { status: 500 });
  }
}
