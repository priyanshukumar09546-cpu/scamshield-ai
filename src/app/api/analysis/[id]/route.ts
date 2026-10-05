import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { officialVerificationEngine } from '@/lib/official-verification';

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

    const detectedRedFlags = JSON.parse(record.detectedRedFlags || '[]');
    const evidenceItems = JSON.parse(record.evidenceItems || '[]');
    const safeActions = JSON.parse(record.safeActions || '[]');
    const trustedSources = JSON.parse(record.trustedSources || '[]');
    const threatIntelSummary = JSON.parse(record.threatIntelStatus || '{}');

    // Run official verification engine on stored evidence and explanation
    const combinedContent = `${record.explanation} ${detectedRedFlags.join(' ')} ${evidenceItems.map((e: any) => e.details || '').join(' ')}`;
    const officialVerification = officialVerificationEngine.verifyContent(combinedContent);

    return NextResponse.json({
      id: record.id,
      inputType: record.inputType,
      riskScore: record.riskScore,
      riskLevel: record.riskLevel,
      confidence: record.confidence,
      category: record.category,
      explanation: record.explanation,
      uncertainty: record.uncertainty,
      detectedRedFlags,
      evidenceItems,
      safeActions,
      trustedSources,
      officialVerification,
      threatIntelSummary,
      signals: record.signals,
      processingTimeMs: record.processingTimeMs,
      createdAt: record.createdAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve analysis.', details: error?.message }, { status: 500 });
  }
}
