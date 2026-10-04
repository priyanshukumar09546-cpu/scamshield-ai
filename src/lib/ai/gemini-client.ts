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
}

export const geminiProvider = new GeminiAIProvider();
