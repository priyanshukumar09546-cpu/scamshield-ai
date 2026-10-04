# 🛡️ ScamShield AI

### Before You Trust It, Verify It.

AI-powered investor protection against digital financial scams, phishing and misleading financial content.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Multimodal-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 1. Overview

**ScamShield AI** is an advanced, privacy-first cybersecurity and investor protection platform built specifically to safeguard retail investors and citizens against digital financial scams, phishing campaigns, deceptive investment schemes, and impersonation fraud.

Engineered for the Indian financial ecosystem, ScamShield AI combines multimodal input intelligence, multi-agent AI orchestration, authoritative regulatory Retrieval-Augmented Generation (RAG), deterministic rule engines, and calibrated risk fusion to analyze suspicious content across screenshots, URLs, texts, investment documents, and audio clips.

---

## 2. Problem

India's retail investment boom has been accompanied by an unprecedented surge in sophisticated digital financial fraud:
- **Digital Arrest & Police Impersonation Scams**: Criminal syndicates posing as CBI, ED, Mumbai Police, or Supreme Court officials coerces victims into liquidating assets into "safe escrow accounts".
- **Guaranteed High-Yield Investment Schemes**: Fake WhatsApp/Telegram trading groups promising 200–500% weekly returns, Ponzi setups, and fabricated institutional allocations.
- **Phishing & Lookalike Portals**: Typosquatted and punycode domains impersonating premier banking institutions (SBI, HDFC, ICICI) to harvest credentials and OTPs.
- **Unregistered Advisors & Dabba Trading**: Fraudulent operators running illegal off-market trading platforms claiming SEBI registration with forged registration certificates.
- **Asymmetric Information & Verification Delay**: The critical "Golden Hour" after initial contact is lost because retail victims lack immediate, trusted tools to verify claims against statutory regulatory circulars.

---

## 3. Solution

ScamShield AI delivers an automated, instantaneous verification shield that evaluates any suspicious financial communication in seconds before money changes hands:
- **Zero-Trust Multi-Agent Pipeline**: Evaluates input through specialized AI agents for phishing, Ponzi mechanics, regulatory impersonation, and statutory violations.
- **Deterministic Statutory Guardrails**: Hardcoded financial laws (SEBI Prohibition of Fraudulent and Unfair Trade Practices Regulations, RBI Public Advisory circulars) that trigger immediate risk floors regardless of LLM persuasiveness.
- **Authoritative Grounded RAG**: Cross-references claims directly with authentic regulatory circulars from SEBI, RBI SACHET, CERT-In, and the National Cyber Crime Reporting Portal (1930).
- **Client-Side Privacy Redaction**: Automatically detects and masks sensitive Personally Identifiable Information (Aadhaar, PAN, phone numbers, UPI IDs, credit cards, OTPs) before server ingestion.
- **Actionable Multilingual Guidance**: Generates clear, plain-language risk breakdowns with immediate safe actions in English, Hindi (हिंदी), and Hinglish.

---

## 4. Key Features

1. **Multimodal Verification Center (`/check`)**:
   - **Screenshot Vision & OCR**: Upload screenshots from WhatsApp, Telegram, Instagram ads, or SMS messages. Optical Character Recognition extracts text, phone numbers, and hidden links.
   - **Hardened URL Scanner**: Evaluates URLs against homograph attacks, typosquatting, private IP subnets, and live threat intelligence feeds.
   - **SMS & Pitch Text Analyzer**: Evaluates high-pressure urgency, advance-fee traps, and guaranteed returns.
   - **PDF Prospectus Inspector**: Extracts financial claims and clauses from investment brochures.
   - **Voice Note Input**: Transcribes and analyzes spoken fraud pitches.

2. **Deterministic Safety Rule Engine**:
   - Over 15 statutory financial safety rules flagging prohibited claims (e.g. `GUARANTEED_RETURN`, `OTP_REQUEST`, `DIGITAL_ARREST`, `UNREALISTIC_RETURN`, `REVERSE_REMOTE_ACCESS`).

3. **Authoritative Grounded RAG**:
   - Regulatory corpus referencing verified circulars from SEBI, RBI, CERT-In, and National Cyber Crime Portal. Never invents citations or fake URLs.

4. **Zero-Fake Live Data**:
   - All dashboard analytics, history logs, and risk assessments reflect actual database queries and real pipeline runs. Pre-loaded interactive testing samples are clearly marked `SAMPLE — FOR TESTING ONLY` and run through the actual backend pipeline.

5. **Live Multilingual Translation**:
   - Instant 1-click toggle to translate risk assessments, red flags, and safe actions into **Hindi (हिंदी)** and **Hinglish**.

6. **Privacy-by-Design Architecture**:
   - Automatically sanitizes and redacts PAN cards, Aadhaar numbers, mobile numbers, UPI IDs, and OTPs before analysis.

7. **History & Threat Cataloging**:
   - User analysis records tied to authenticated sessions with selective deletion and clear-all controls.
   - Community Citizen Scam Reporting portal (`/report`) to catalog emerging threat vectors.

8. **Accessible Typography Hierarchy**:
   - Rigorously calibrated typography (16–18px desktop body, 15–16px card text, 14–16px footer, 13px min metadata, 15–16px mobile body) ensuring effortless readability across all screen sizes.

---

## 5. How It Works

```
USER INPUT (Screenshot / URL / Text / Document / Audio)
         │
         ▼
[1] CLIENT PRIVACY & EXTRACTION
         ├── Sensitive PII Redaction (Aadhaar, PAN, UPI, Phone, OTPs masked)
         ├── Optical Character Recognition (Tesseract.js OCR)
         └── Document Parser (pdf-parse text & claim extractor)
         │
         ▼
[2] AI AGENT ORCHESTRATOR
         ├── Scam Detection Agent (High-yield schemes, Ponzi markers, urgency cues)
         ├── Phishing Analysis Agent (Lookalikes, punycode, credential harvesting paths)
         ├── Impersonation Agent (Unauthorized use of SEBI, RBI, SBI, HDFC marks)
         ├── Claim Verification Agent (Checks against SEBI statutory prohibitions)
         └── Multimodal Reasoning (Gemini GenAI SDK + deterministic fallback)
         │
         ▼
[3] KNOWLEDGE & THREAT LAYER
         ├── Authoritative RAG Corpus (SEBI Circulars, RBI SACHET, CERT-In advisories)
         ├── Threat Intelligence Connectors (Google Web Risk, VirusTotal, SSRF Shield)
         └── Fraud Knowledge Graph (Entity-relationship network: Domains ↔ Scam Patterns)
         │
         ▼
[4] RISK FUSION ENGINE
         ├── Calibrated Heuristic Weighted Scoring (0–100 Risk Score)
         ├── Transparent Categorization (HIGH / MEDIUM / LOW / UNCERTAIN)
         └── Critical Override Floors (Immediate 82+ floor on credential solicitation)
         │
         ▼
[5] EXPLAINABLE MULTILINGUAL AI
         ├── Detected Red Flags & Quotable Evidence
         ├── Immediate Safe Actions Checklist
         ├── Explicit Uncertainty & Scope Limitations
         └── Live Multilingual Output (English, Hindi हिंदी, Hinglish)
```

---

## 6. System Architecture

ScamShield AI utilizes a decoupled, modern architecture:
- **Frontend Layer**: Next.js 14.2 App Router with React Server Components, responsive Tailwind CSS design system, and client-side reactive state management.
- **Backend API Layer**: Next.js Route Handlers exposing robust REST endpoints (`/api/analyze/text`, `/api/analyze/url`, `/api/analyze/image`, `/api/analyze/document`, `/api/history`, `/api/reports`, `/api/threat-intel`, `/api/health`).
- **Database & Data Layer**: Prisma 5.22 ORM supporting SQLite for instant zero-dependency local development and production-grade PostgreSQL with connection pooling.
- **Security Middleware**: In-memory token bucket rate limiting, SSRF IP validation, cookie-based JWT authentication via `jose`, and `bcryptjs` password hashing.

---

## 7. AI Architecture

The intelligence backbone is orchestrated as a multi-specialist cooperative agent system:
1. **Scam Detection Agent**: Analyzes semantic indicators of advance-fee fraud, Ponzi structures, guaranteed return promises, artificial deadlines, and multi-level marketing scripts.
2. **Phishing & Network Agent**: Inspects URL structure, punycode characters, homoglyphs, suspicious subdomains, top-level domain reputation, and credential harvesting forms.
3. **Impersonation Agent**: Detects forged regulatory seals, unauthorized claims of SEBI/RBI registration, fake government official identities (CBI/ED), and bank lookalikes.
4. **Claim Verification Agent**: Compares specific financial promises against statutory Indian regulations (e.g. SEBI circular SEBI/HO/MIRSD/DOS3/CIR/P/2018/140).
5. **Multimodal Vision Engine**: Utilizes Google Gemini (`gemini-1.5-flash`) via `@google/generative-ai` when configured; automatically activates robust local deterministic heuristics when external API keys are not supplied.

---

## 8. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.2 (React 18) | Server-rendered pages, App Router, responsive UX |
| **Language** | TypeScript 5.0 | End-to-end type safety across backend and client |
| **Styling & Design System** | Tailwind CSS 3.4 | Cyber-fintech dark theme, glassmorphism, responsive grid |
| **Database & ORM** | Prisma ORM 5.22 | Schema management, type-safe queries, migration lifecycle |
| **Databases** | SQLite (Dev) / PostgreSQL (Prod) | Local zero-config speed & production scalability |
| **AI Integration** | Google Generative AI SDK | Multimodal vision & reasoning pipeline |
| **OCR Engine** | Tesseract.js | Client-side/local optical character recognition |
| **Document Parser** | pdf-parse | PDF prospectus text extraction |
| **Security & Auth** | `jose` (JWT) & `bcryptjs` | HTTP-only cookie sessions, salted password storage |
| **Testing** | Node.js Native Test Runner | Unit and integration testing (`node --test`) |
| **Containerization** | Docker | Production container image packaging |

---

## 9. RAG (Retrieval-Augmented Generation)

ScamShield AI rejects hallucinated citations. Its RAG knowledge base is pre-seeded with genuine, uncompromised regulatory circulars:
- **SEBI (Securities and Exchange Board of India)**: Circulars on unauthorized investment advisory, assured return schemes, and unregistered Telegram/WhatsApp trading channels.
- **RBI SACHET**: Reserve Bank of India advisories on illegal lending apps, unauthorized deposit schemes, and Mule accounts.
- **CERT-In (Indian Computer Emergency Response Team)**: Security alerts on phishing campaigns, banking malware, and remote access trojans (AnyDesk/TeamViewer abuse).
- **National Cyber Crime Portal**: Official definitions, reporting procedures, and 1930 helpline guidelines.

If a query does not match any indexed regulatory documentation, the platform transparently reports an honest ungrounded state rather than synthesizing artificial citations.

---

## 10. Threat Intelligence

The platform features unified connectors for external threat intelligence providers:
- **VirusTotal API Connector**: Scans domains and URLs against 70+ antivirus engines and malicious threat databases.
- **Google Web Risk API Connector**: Validates URIs against Google's constantly updated lists of unsafe web resources (social engineering, malware, unwanted software).
- **Graceful Fallback**: If external API keys are not provisioned in the environment, the platform maintains 100% functionality and explicitly displays `Threat Intelligence: Unavailable (API key required)` without falsely declaring unknown resources "safe".

---

## 11. Risk Fusion

The Risk Fusion Engine synthesizes multi-source inputs into an explainable 0–100 Risk Score using transparent, calibrated weights:

$$Score = w_{rules} \cdot S_{rules} + w_{ai} \cdot S_{ai} + w_{url} \cdot S_{url} + w_{rag} \cdot S_{rag} + w_{intel} \cdot S_{intel}$$

### Safety Override Floors
Regardless of other signals, high-severity violations trigger mandatory minimum risk floors:
- **Credential / OTP Solicitation**: Immediate floor of **85/100 (HIGH RISK)**.
- **Digital Arrest / Impersonation Coercion**: Immediate floor of **82/100 (HIGH RISK)**.
- **Guaranteed High-Yield Financial Return**: Immediate floor of **75/100 (HIGH RISK)**.
- **SSRF / Malicious IP**: Immediate rejection and **100/100 (CRITICAL DANGER)**.

---

## 12. Privacy & Security

ScamShield AI implements defense-in-depth across the entire request lifecycle:
- **PII Scrubbing**: Regex and entropy-based identification of Indian Aadhaar numbers, PAN cards, phone numbers, UPI VPA handles, bank account numbers, and OTPs, masked prior to external analysis.
- **SSRF Prevention**: All URL inspection requests validate resolved IP addresses. Private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks (`127.0.0.0/8`), link-local (`169.254.0.0/16`), and AWS/GCP cloud metadata endpoints (`169.254.169.254`) are strictly blocked.
- **Prompt Injection Defense**: Input text is evaluated against adversarial injection jailbreaks, delimiter collisions, and instruction overrides.
- **Session Security**: Stateless, tamper-proof JSON Web Tokens signed with HMAC-SHA256, delivered exclusively over `HttpOnly`, `SameSite=Lax`, secure cookies.

---

## 13. Screenshots

The following screenshots are captured directly from the live running ScamShield AI production deployment:

### Home Page
![ScamShield AI Home](docs/screenshots/home.png)

### Multimodal Analysis Center (`/check`)
![AI Analysis Input](docs/screenshots/analysis.png)

### Risk Assessment & Red Flag Explainability
![Risk Result](docs/screenshots/risk-result.png)

### Real Analytics Dashboard (`/dashboard`)
![Dashboard](docs/screenshots/dashboard.png)

### Verified Scan History (`/history`)
![History](docs/screenshots/history.png)

### Investor Education & Scam Encyclopedia (`/learn`)
![Learn](docs/screenshots/learn.png)

### Citizen Scam Reporting Portal (`/report`)
![Report](docs/screenshots/report.png)

### Mobile Responsive Experience (390px Viewport)
![Mobile Experience](docs/screenshots/mobile.png)

---

## 14. Demo Flow

Experience ScamShield AI in action using the following live demonstration sequence:

1. **Navigate to the Analysis Center**: Go to `http://localhost:3000/check`.
2. **Select an Interactive Sample**: In the test banner, click **Sample 1: WhatsApp Guaranteed Returns Scam**.
3. **Execute Analysis**: Click **Start AI Safety Analysis**.
4. **Inspect Pipeline Progression**:
   - Multimodal OCR / Text extraction
   - Automatic PII masking
   - Deterministic rule engine triggers (`GUARANTEED_RETURN`, `UNREALISTIC_RETURN`)
   - Regulatory RAG lookup (SEBI Advisory citation)
   - Risk Fusion scoring (**Score: 82/100 — HIGH RISK**)
5. **Verify Explainability**: Inspect the Red Flags checklist, Evidence quotes, and Immediate Safe Actions.
6. **Test Live Multilingual AI**: Click the **हिंदी (Hindi)** or **Hinglish** button in the result header to see real-time translation of the analysis.
7. **Test Benign Legitimate SMS**: Click **Sample 5: Benign Legitimate Banking SMS** to confirm zero false positives (**Score: 8/100 — LOW RISK**).
8. **Test SSRF Protection**: In the URL scanner, enter `http://169.254.169.254/latest/meta-data/` or `http://localhost:8080` to see instant security blocking.

---

## 15. Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd iit-bhu

# Install dependencies
npm install

# Initialize local database and seed regulatory documents
npx prisma generate
npx prisma db push
node prisma/seed.js

# Build production bundle
npm run build

# Start production server
npm run start
```

The application will be live at `http://localhost:3000`.

---

## 16. Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
# Database Configuration
# Local development default:
DATABASE_URL="file:./dev.db"
# Production PostgreSQL example:
# DATABASE_URL="postgresql://user:password@hostname:5432/scamshield?schema=public"

# Google Gemini Multimodal AI API (Optional - local fallback active if unset)
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"

# Threat Intelligence Integrations (Optional)
VIRUSTOTAL_API_KEY=""
GOOGLE_WEB_RISK_API_KEY=""

# Authentication & Session Security
JWT_SECRET="replace-with-your-secure-random-32-character-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 17. Database Setup

ScamShield AI utilizes Prisma ORM with dual-engine readiness:

### Local Development (SQLite)
Zero external dependencies. The local SQLite database is created automatically:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### Production (PostgreSQL)
To connect to an external PostgreSQL instance (e.g. Supabase, Neon, AWS RDS, Railway):
1. Set `DATABASE_URL="postgresql://username:password@host:port/database"` in `.env`.
2. Update `provider = "postgresql"` in `prisma/schema.prisma`.
3. Run `npx prisma db push` to synchronize schemas.
4. Run `node prisma/seed.js` to seed official regulatory documentation.

---

## 18. Testing

ScamShield AI includes a native unit and integration test suite covering security, parsing, rules, and risk scoring.

```bash
# Execute test suite
npm test
```

### Verified Test Matrix (20/20 Passing)
- `tests/pii.test.js`: Aadhaar, PAN card, phone numbers, UPI handles, and OTP redaction.
- `tests/ssrf.test.js`: Localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, and AWS 169.254.169.254 blocking.
- `tests/rules.test.js`: Guaranteed return, OTP request, digital arrest, and Ponzi indicators.
- `tests/security.test.js`: Prompt injection defense and adversarial token handling.
- `tests/risk-fusion.test.js`: Score calculation, category assignment, and high-risk safety floors.

---

## 19. Deployment

### Option A: Vercel (Frontend & Serverless API)
1. Push codebase to your GitHub repository.
2. Import project into [Vercel](https://vercel.com).
3. Configure Environment Variables (`DATABASE_URL`, `JWT_SECRET`, etc.).
4. Deploy!

### Option B: Docker Container
Build and run the verified production Docker container:
```bash
# Build Docker image
docker build -t scamshield-ai:latest .

# Run container
docker run -p 3000:3000 -e JWT_SECRET="your-jwt-secret-here" scamshield-ai:latest
```

---

## 20. Safety Disclaimer

> **Statutory Notice**: ScamShield AI is an informational cybersecurity and investor education tool designed to identify common indicators of digital financial fraud and evaluate communications against statutory regulatory guidance.
> 
> - ScamShield AI **does not** provide investment, legal, tax, or financial advice.
> - ScamShield AI **does not** issue buy, sell, or hold recommendations for any securities.
> - Never share your bank passwords, ATM PINs, UPI PINs, or OTPs with anyone, including ScamShield AI.

---

## 21. Hackathon Track

- **Competition**: Inter-IIT / National Hackathon Series
- **Track**: **Track A — Digital Fraud & Scam Resilience**
- **Theme**: AI-powered fraud resilience, retail investor protection, and proactive cybersecurity tooling for Bharat.

---

## 22. Team

**Team ScamShield AI**  
- Developed with dedication to empowering Indian citizens and retail investors against cyber fraud syndicates.
- Dedicated to the vision of a cyber-resilient, financially secure digital India.

For inquiries, support, or regulatory coordination, please visit the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in) or dial **1930**.
