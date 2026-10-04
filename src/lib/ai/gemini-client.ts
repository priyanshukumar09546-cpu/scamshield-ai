import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIProviderConfig {
  apiKey?: string;
  modelName?: string;
}

export interface AgentStructuredOutput {
  category: string;
  riskSignals: Array<{
    code: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }>;
  explanation: string;
  uncertainty: string;
  safeActions: string[];
}

export class GeminiAIProvider {
  private client: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor(config?: AIProviderConfig) {
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    this.modelName = config?.modelName || process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (apiKey && apiKey.trim() !== '') {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  public isAvailable(): boolean {
    return this.client !== null;
  }

  public async analyzeContent(
    systemPrompt: string,
    userContent: string,
    extractedUrls: string[]
  ): Promise<AgentStructuredOutput | null> {
    if (!this.client) {
      return null;
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Deterministic, analytical
        },
      });

      const prompt = `
${systemPrompt}

IMPORTANT: You are an investor protection AI. Never provide buy, sell, hold recommendations or financial speculation.
Analyze the following untrusted user content for fraud signals:

--- USER CONTENT START ---
${userContent}
--- USER CONTENT END ---

EXTRACTED URLS: ${JSON.stringify(extractedUrls)}

Return strictly valid JSON matching this schema:
{
  "category": "Potential Investment Scam | Phishing Attempt | Credential Harvesting | Impersonation | Suspicious Solicitation | Benign Content",
  "riskSignals": [
    {
      "code": "SIGNAL_CODE",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "description": "Specific evidence quote and reason"
    }
  ],
  "explanation": "Clear, concise analysis of why this was flagged or found safe without jargon",
  "uncertainty": "Transparent statement of what could not be independently verified",
  "safeActions": [
    "Immediate actionable safety steps for the user"
  ]
}
`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      return {
        category: parsed.category || 'General Risk Assessment',
        riskSignals: Array.isArray(parsed.riskSignals) ? parsed.riskSignals : [],
        explanation: parsed.explanation || 'Analysis completed.',
        uncertainty: parsed.uncertainty || 'Evaluation based strictly on visible textual elements.',
        safeActions: Array.isArray(parsed.safeActions) ? parsed.safeActions : [],
      };
    } catch (error) {
      console.warn('Gemini API call failed or timed out:', error);
      return null;
    }
  }

  public async analyzeImage(
    systemPrompt: string,
    imageBase64: string,
    mimeType: string,
    ocrText?: string
  ): Promise<AgentStructuredOutput | null> {
    if (!this.client) {
      return null;
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const prompt = `
${systemPrompt}

IMPORTANT: You are an investor protection AI examining a financial screenshot or document.
Look for visual tampering, forged regulatory seals, deceptive UI, fake returns, and high-pressure text.
${ocrText ? `Extracted OCR Text: "${ocrText}"` : ''}

Return strictly valid JSON matching this schema:
{
  "category": "Potential Investment Scam | Phishing Attempt | Credential Harvesting | Impersonation | Suspicious Solicitation | Benign Content",
  "riskSignals": [
    {
      "code": "SIGNAL_CODE",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "description": "Specific visual/textual evidence quote and reason"
    }
  ],
  "explanation": "Clear, concise analysis of why this was flagged or found safe without jargon",
  "uncertainty": "Transparent statement of what could not be independently verified",
  "safeActions": [
    "Immediate actionable safety steps for the user"
  ]
}
`;

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: mimeType,
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      return {
        category: parsed.category || 'Visual Assessment',
        riskSignals: Array.isArray(parsed.riskSignals) ? parsed.riskSignals : [],
        explanation: parsed.explanation || 'Screenshot analysis completed.',
        uncertainty: parsed.uncertainty || 'Evaluation based on visual elements present in the screenshot.',
        safeActions: Array.isArray(parsed.safeActions) ? parsed.safeActions : [],
      };
    } catch (error) {
      console.warn('Gemini multimodal image analysis failed:', error);
      return null;
    }
  }
}

export const geminiProvider = new GeminiAIProvider();
