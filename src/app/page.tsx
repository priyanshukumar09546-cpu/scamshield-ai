'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import {
  ShieldAlert,
  Search,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Cpu,
  Eye,
  AlertTriangle,
  Globe2,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useApp();

  return (
    <div className="flex flex-col gap-20 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-400 mb-8 shadow-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 animate-ping"></span>
          <span>Track A — Digital Fraud & Scam Resilience</span>
        </div>

        {/* Brand & Main Headline */}
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
            {t.tagline}
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-foreground/80 mb-10 leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Link
            href="/check?tab=screenshot"
            className="flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-[1.02]"
          >
            <ImageIcon className="h-5 w-5" />
            <span>{t.analyzeScreenshot}</span>
          </Link>
          <Link
            href="/check?tab=url"
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card/90 px-6 py-3.5 text-base font-semibold text-foreground hover:bg-muted/90 transition-all hover:scale-[1.02]"
          >
            <LinkIcon className="h-5 w-5 text-blue-400" />
            <span>{t.checkUrl}</span>
          </Link>
          <Link
            href="/check?tab=text"
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card/90 px-6 py-3.5 text-base font-semibold text-foreground hover:bg-muted/90 transition-all hover:scale-[1.02]"
          >
            <FileText className="h-5 w-5 text-emerald-400" />
            <span>{t.analyzeMessage}</span>
          </Link>
        </div>

        {/* Secondary Action */}
        <div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground hover:text-blue-400 transition-colors"
          >
            <span>{t.learnAboutScams}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Safety Guardrail Highlight */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400 shrink-0">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Strict Guardrails Enforced</h3>
                <p className="text-sm sm:text-[15px] text-foreground/80 mt-1.5 leading-relaxed">
                  ScamShield AI is solely dedicated to fraud detection, linguistic pattern verification, and investor safety. 
                  It strictly does not provide stock tips, buy/sell/hold calls, or financial speculation.
                </p>
              </div>
            </div>
            <Link
              href="/check"
              className="whitespace-nowrap rounded-xl bg-blue-600/30 border border-blue-500/40 px-5 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-600/50 transition-colors"
            >
              Verify Content Now
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture & Real Capabilities Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Engineering & Intelligence Architecture
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-3 max-w-3xl mx-auto leading-relaxed">
            A multi-layered defense pipeline combining deterministic statutory rules, SSRF-hardened network intelligence, and authoritative regulatory grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Multimodal Input Extraction</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Optical Character Recognition (OCR) extracts text from screenshots of WhatsApp chats, Telegram groups, and Instagram posts. Extracts hidden links and performs PII sanitization.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-4">
              <LinkIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">SSRF-Hardened URL Intelligence</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Domain syntax normalization, punycode/homograph detection, high-abuse TLD analysis, credential harvesting path analysis, and VirusTotal / Google Web Risk threat connectors.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Agentic AI Orchestrator</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Coordinates specialized agents (Scam Detection, Phishing Analysis, Impersonation, and Claim Verification) in parallel, powered by structured multimodal Gemini reasoning.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Authoritative RAG Grounding</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Cites verified advisories directly from SEBI, RBI SACHET registry, CERT-In, and National Cyber Crime Portal (1930). Never generates fabricated source citations.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Risk Fusion Engine</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Transparent, weighted heuristic evaluation synthesizing agent flags, statutory rules, and network signals into calibrated 0–100 risk scores with clear confidence metrics.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card rounded-2xl p-7 glass-card-hover transition-all space-y-3">
            <div className="h-12 w-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-4">
              <Globe2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Explainable Multilingual AI</h3>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Instant one-click translation into Hindi and Hinglish. Outlines specific red flags, tangible evidence quotes, uncertainty caveats, and immediate actionable safety steps.
            </p>
          </div>
        </div>
      </section>

      {/* Live Pipeline Flow Diagram */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card/70 p-8 sm:p-10 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 text-center">Live Analysis Pipeline Stages</h3>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            Every analysis runs through real multi-stage validation without artificial delays.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/80 bg-background/80 p-5 space-y-2">
              <span className="text-blue-400 font-bold text-base block">01. Ingestion</span>
              <p className="text-sm text-foreground/90 font-medium">OCR & Multimodal Parsing</p>
              <p className="text-[13px] text-muted-foreground leading-normal">Extracts characters, speech transcripts & redacts sensitive PII.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/80 p-5 space-y-2">
              <span className="text-indigo-400 font-bold text-base block">02. Network Intel</span>
              <p className="text-sm text-foreground/90 font-medium">SSRF & Threat Scanners</p>
              <p className="text-[13px] text-muted-foreground leading-normal">Blocks internal IPs; checks lookalike domains & VirusTotal reputation.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/80 p-5 space-y-2">
              <span className="text-emerald-400 font-bold text-base block">03. Rule & RAG</span>
              <p className="text-sm text-foreground/90 font-medium">Regulatory Cross-Check</p>
              <p className="text-[13px] text-muted-foreground leading-normal">Evaluates statutory SEBI bans and matches authentic circulars.</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/80 p-5 space-y-2">
              <span className="text-cyan-400 font-bold text-base block">04. Risk Fusion</span>
              <p className="text-sm text-foreground/90 font-medium">Explainable Verdict</p>
              <p className="text-[13px] text-muted-foreground leading-normal">Calculates heuristic score, red flags & safe action checklist.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
