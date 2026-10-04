import { NextResponse } from 'next/server';
import { geminiProvider } from '@/lib/ai/gemini-client';

export async function GET() {
  const isConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  return NextResponse.json({
    provider: 'Google GenAI SDK (Gemini)',
    configured: isConfigured,
    model: modelName,
    status: isConfigured ? 'READY' : 'KEY_NOT_CONFIGURED',
    fallbackAvailable: true,
    fallbackMode: 'Deterministic Heuristic Rule & Agent Suite',
    disclaimer: isConfigured
      ? 'Gemini Multimodal reasoning model active.'
      : 'GEMINI_API_KEY not configured. Deterministic local safety rules, RAG, and URL engines are active.',
  });
}
