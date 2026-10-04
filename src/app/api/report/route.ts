import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { knowledgeGraph } from '@/lib/knowledge-graph';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportType, targetIdentifier, title, description, evidenceText } = body;

    if (!reportType || !targetIdentifier || !title) {
      return NextResponse.json(
        { error: 'reportType, targetIdentifier, and title are required fields.' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    const report = await db.report.create({
      data: {
        userId: user?.id || null,
        reportType,
        targetIdentifier: targetIdentifier.trim(),
        title: title.trim(),
        description: description?.trim() || '',
        evidenceText: evidenceText?.trim() || null,
        status: 'RECORDED',
      },
    });

    // If report targets a domain, update knowledge graph entity
    if (reportType === 'URL' || targetIdentifier.includes('.')) {
      try {
        const domain = targetIdentifier.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
        await knowledgeGraph.recordEntityRelationship(
          domain,
          'DOMAIN',
          title,
          'SCAM_PATTERN',
          'ASSOCIATED_WITH',
          `Citizen fraud report #${report.id}`
        );
      } catch (gErr) {
        console.warn('Knowledge graph update notice:', gErr);
      }
    }

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Your report has been recorded in the ScamShield threat database.',
      disclaimer: 'Note: To file an official statutory police complaint, please visit cybercrime.gov.in or dial national helpline 1930.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record report.', details: error?.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const reports = await db.report.findMany({
      where: user ? { userId: user.id } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch reports.', details: error?.message }, { status: 500 });
  }
}
