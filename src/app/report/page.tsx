'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const { user } = useApp();

  const [reportType, setReportType] = useState('SCAM_MESSAGE');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceText, setEvidenceText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const identParam = searchParams.get('identifier');
    const titleParam = searchParams.get('title');
    if (identParam) setTargetIdentifier(identParam);
    if (titleParam) setTitle(titleParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (!targetIdentifier.trim() || !title.trim()) {
        throw new Error('Please fill in the target identifier and summary title.');
      }

      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          targetIdentifier,
          title,
          description,
          evidenceText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit scam report.');
      }

      setSubmissionSuccess(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/25 px-4 py-1.5 text-xs sm:text-sm font-semibold text-red-400 mb-4 shadow-sm">
          <ShieldAlert className="h-4 w-4" />
          <span>Community Fraud Resilience Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Report Suspicious Financial Content
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
          Help protect fellow retail investors by cataloging newly active fraudulent domains, impersonation handles, and phishing links.
        </p>
      </div>

      {submissionSuccess ? (
        <div className="glass-card rounded-2xl p-8 sm:p-10 border border-emerald-500/30 bg-emerald-950/15 text-center animate-in fade-in shadow-xl space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Your Report Has Been Recorded
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {submissionSuccess.message} Reference ID: <span className="font-mono font-bold text-blue-400">{submissionSuccess.reportId}</span>
          </p>

          <div className="rounded-xl border border-border bg-background/60 p-5 text-sm text-foreground/80 text-left max-w-xl mx-auto leading-relaxed space-y-1.5">
            <p className="font-bold text-foreground">Official Statutory Notice:</p>
            <p>{submissionSuccess.disclaimer}</p>
          </div>

          <button
            onClick={() => {
              setSubmissionSuccess(null);
              setTargetIdentifier('');
              setTitle('');
              setDescription('');
              setEvidenceText('');
            }}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 sm:p-10 border border-border space-y-6 shadow-xl">
          {errorMsg && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground mb-2">
              Category of Threat:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm sm:text-base text-foreground focus:border-blue-500 focus:outline-none"
            >
              <option value="SCAM_MESSAGE" className="bg-slate-900">Scam Message (WhatsApp / SMS / Telegram)</option>
              <option value="URL" className="bg-slate-900">Phishing / Malicious Website URL</option>
              <option value="IMPERSONATION" className="bg-slate-900">Impersonation of Bank, SEBI, or Authority</option>
              <option value="INVESTMENT_AD" className="bg-slate-900">Fraudulent Investment Advertisement</option>
              <option value="SOCIAL_ACCOUNT" className="bg-slate-900">Fraudulent Social Media Account / Handle</option>
              <option value="OTHER" className="bg-slate-900">Other Deceptive Financial Solicitation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground mb-2">
              Target Identifier (URL, Mobile Number, Domain, or Handle):
            </label>
            <input
              type="text"
              required
              value={targetIdentifier}
              onChange={(e) => setTargetIdentifier(e.target.value)}
              placeholder="e.g. https://sbi-kyc-update.top or +91 98765 43210 or @zerodha_vip_bot"
              className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground mb-2">
              Incident Summary / Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fake SEBI institutional trading bot promising 40% monthly returns"
              className="w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground mb-2">
              Detailed Description & Context:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how contact was initiated, demands made, or suspicious behavior observed..."
              className="w-full rounded-xl border border-border bg-input/40 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground mb-2">
              Evidence Quotes or Excerpts:
            </label>
            <textarea
              rows={3}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder="Paste exact message text, bank account numbers requested, or links given..."
              className="w-full rounded-xl border border-border bg-input/40 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="rounded-xl border border-border/80 bg-background/50 p-4 text-xs sm:text-sm text-muted-foreground flex items-start gap-3 leading-relaxed">
            <Lock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your report contributes to our fraud knowledge graph. PII is automatically sanitized. Reports are recorded in ScamShield threat databases and are not an automatic substitute for statutory police FIRs.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Recording Report...' : 'Submit Fraud Incident Report'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
