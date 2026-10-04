import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let dbStatus = 'disconnected';
  try {
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e: any) {
    dbStatus = 'error';
  }

  const aiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  const threatIntelConfigured = Boolean(
    (process.env.VIRUSTOTAL_API_KEY && process.env.VIRUSTOTAL_API_KEY.trim() !== '') ||
    (process.env.GOOGLE_WEB_RISK_API_KEY && process.env.GOOGLE_WEB_RISK_API_KEY.trim() !== '')
  );

  return NextResponse.json({
    status: 'operational',
    service: 'ScamShield AI',
    version: '1.0.0',
    database: dbStatus,
    ai: aiConfigured ? 'configured' : 'not_configured',
    rag: 'configured',
    threat_intelligence: threatIntelConfigured ? 'configured' : 'not_configured',
    rule_engine: 'operational',
    pii_redaction: 'operational',
    timestamp: new Date().toISOString(),
  });
}
