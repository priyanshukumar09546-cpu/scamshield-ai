import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveAnalysis } from '@/lib/analysis-service';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF document uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF documents are supported for document analysis.' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF exceeds maximum file size limit of 15MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    try {
      const data = await pdfParse(buffer);
      extractedText = data.text || '';
    } catch (parseErr: any) {
      console.warn('PDF parsing error:', parseErr);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Unable to extract text from this document. It may be an encrypted or scanned image-only PDF.' },
        { status: 422 }
      );
    }

    // Limit text to avoid token overflows while preserving key financial clauses
    const trimmedText = extractedText.substring(0, 15000);
    const result = await processAndSaveAnalysis(trimmedText, 'DOCUMENT');

    return NextResponse.json({
      ...result,
      documentName: file.name,
      pageCountEstimated: Math.ceil(extractedText.length / 2500),
    });
  } catch (error: any) {
    console.error('Error in /api/analyze/document:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF document.', details: error?.message },
      { status: 500 }
    );
  }
}
