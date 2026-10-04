import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveAnalysis } from '@/lib/analysis-service';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local-client';
    const limitCheck = checkRateLimit(`url_${ip}`, { windowMs: 60 * 1000, maxRequests: 40 });
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting more URL analyses.', retryAfterSec: limitCheck.retryAfterSec },
        { status: 429 }
      );
    }

    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json({ error: 'URL is required for analysis.' }, { status: 400 });
    }

    const cleanUrl = url.trim();
    const result = await processAndSaveAnalysis(`Analyze website link: ${cleanUrl}`, 'URL', cleanUrl);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/analyze/url:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during URL analysis.', details: error?.message },
      { status: 500 }
    );
  }
}
