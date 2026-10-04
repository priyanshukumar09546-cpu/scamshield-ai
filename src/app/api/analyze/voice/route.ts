import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveAnalysis } from '@/lib/analysis-service';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let transcriptText = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      transcriptText = body?.transcript || body?.text || '';
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      transcriptText = (formData.get('transcript') as string) || '';
    }

    if (!transcriptText || transcriptText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Voice transcript content is empty. Please speak or provide a voice transcript.' },
        { status: 400 }
      );
    }

    const result = await processAndSaveAnalysis(transcriptText, 'VOICE');
    return NextResponse.json({
      ...result,
      transcript: transcriptText,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze/voice:', error);
    return NextResponse.json(
      { error: 'Failed to process voice note.', details: error?.message },
      { status: 500 }
    );
  }
}
