import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveAnalysis } from '@/lib/analysis-service';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local-client';
    const limitCheck = checkRateLimit(`text_${ip}`, { windowMs: 60 * 1000, maxRequests: 40 });
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting more analyses.', retryAfterSec: limitCheck.retryAfterSec },
        { status: 429 }
      );
    }

    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text content is required for analysis.' }, { status: 400 });
    }

    if (text.length > 20000) {
      return NextResponse.json({ error: 'Text exceeds maximum character limit of 20,000.' }, { status: 400 });
    }

    const result = await processAndSaveAnalysis(text, 'TEXT');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/analyze/text:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during text analysis.', details: error?.message },
      { status: 500 }
    );
  }
}
