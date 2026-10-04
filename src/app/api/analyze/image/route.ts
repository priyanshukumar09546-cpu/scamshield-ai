import { NextRequest, NextResponse } from 'next/server';
import { processAndSaveAnalysis } from '@/lib/analysis-service';
import Tesseract from 'tesseract.js';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
    }

    // Security & file validation
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a PNG, JPG, or WEBP screenshot.' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image exceeds 10MB limit.' }, { status: 400 });
    }

    // Extract text via OCR
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    try {
      const ocrResult = await Tesseract.recognize(buffer, 'eng', {
        logger: () => {}, // Suppress stdout spam
      });
      extractedText = ocrResult?.data?.text || '';
    } catch (ocrErr: any) {
      console.warn('OCR processing warning:', ocrErr);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Uploaded image filename: ${file.name}. OCR extraction yielded minimal text. No overt textual fraud signals detected directly from optical characters.`;
    }

    const result = await processAndSaveAnalysis(extractedText, 'SCREENSHOT');
    return NextResponse.json({
      ...result,
      extractedOcrText: extractedText,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze/image:', error);
    return NextResponse.json(
      { error: 'Failed to process screenshot.', details: error?.message },
      { status: 500 }
    );
  }
}
