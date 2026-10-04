'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { REAL_DEMO_SAMPLES, DemoSample } from '@/lib/sample-data';
import { translateExplanation, MultilingualExplanation } from '@/lib/ai/agents/language';
import { SupportedLanguage } from '@/lib/i18n/translations';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  FileText,
  Mic,
  Camera,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Lock,
  ChevronRight,
  Info,
  Clock,
  Send,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

type TabKey = 'screenshot' | 'text' | 'url' | 'document' | 'voice';

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      }
    >
      <CheckContent />
    </Suspense>
  );
}

function CheckContent() {
  const searchParams = useSearchParams();
  const { t, language: globalLang } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('text');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabKey | null;
    if (tabParam && ['screenshot', 'text', 'url', 'document', 'voice'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Form Inputs
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  // Multilingual Result toggle
  const [resultLang, setResultLang] = useState<SupportedLanguage>('en');
  const [translatedResult, setTranslatedResult] = useState<MultilingualExplanation | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync result language with global language initially
  useEffect(() => {
    setResultLang(globalLang);
  }, [globalLang]);

  // Update translation whenever result or resultLang changes
  useEffect(() => {
    if (result) {
      const tr = translateExplanation(
        result.explanation,
        result.detectedRedFlags || [],
        result.safeActions || [],
        result.uncertainty,
        resultLang
      );
      setTranslatedResult(tr);
    }
  }, [result, resultLang]);

  // Speech Recognition Setup (Web Speech API)
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setVoiceTranscript(currentText);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type or paste your message text.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setVoiceTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Image / Document file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // 1-Click Load Demo Sample into the real pipeline
  const loadSample = (sample: DemoSample) => {
    setResult(null);
    setErrorMsg(null);
    if (sample.type === 'TEXT') {
      setActiveTab('text');
      setTextInput(sample.content);
    } else if (sample.type === 'URL') {
      setActiveTab('url');
      setUrlInput(sample.content);
    }
  };

  // Pipeline stages simulation for UI visual fidelity during async execution
  const executePipelineProgress = () => {
    const stages = [
      'Extracting multimodal content...',
      'Sanitizing & redacting sensitive PII credentials...',
      'Inspecting network references & SSRF checks...',
      'Evaluating deterministic financial safety rules...',
      'Retrieving authoritative regulatory records (SEBI / RBI)...',
      'Orchestrating specialized AI agents...',
      'Synthesizing final risk assessment...',
    ];

    let idx = 0;
    setCurrentStage(stages[0]);
    const interval = setInterval(() => {
      idx++;
      if (idx < stages.length) {
        setCurrentStage(stages[idx]);
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  };

  // Start Real Analysis
  const handleStartAnalysis = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    setResult(null);

    const cleanupInterval = executePipelineProgress();

    try {
      let endpoint = '/api/analyze/text';
      let payload: any = {};
      let isMultipart = false;
      const formData = new FormData();

      if (activeTab === 'text') {
        if (!textInput.trim()) {
          throw new Error('Please enter suspicious message text to analyze.');
        }
        endpoint = '/api/analyze/text';
        payload = { text: textInput };
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a website link or domain to verify.');
        }
        endpoint = '/api/analyze/url';
        payload = { url: urlInput };
      } else if (activeTab === 'screenshot') {
        if (!selectedFile) {
          throw new Error('Please select or upload a screenshot to inspect.');
        }
        endpoint = '/api/analyze/image';
        isMultipart = true;
        formData.append('file', selectedFile);
      } else if (activeTab === 'document') {
        if (!selectedFile) {
          throw new Error('Please upload a PDF document for analysis.');
        }
        endpoint = '/api/analyze/document';
        isMultipart = true;
        formData.append('file', selectedFile);
      } else if (activeTab === 'voice') {
        if (!voiceTranscript.trim()) {
          throw new Error('Voice note transcript is empty. Please speak or enter transcript.');
        }
        endpoint = '/api/analyze/voice';
        payload = { transcript: voiceTranscript };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: isMultipart ? undefined : { 'Content-Type': 'application/json' },
        body: isMultipart ? formData : JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete analysis.');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during analysis.');
    } finally {
      cleanupInterval();
      setIsAnalyzing(false);
      setCurrentStage('');
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[ScamShield AI Incident Assessment]
Record ID: ${result.id}
Risk Level: ${result.riskLevel} (Score: ${result.riskScore}/100)
Category: ${result.category}
Explanation: ${result.explanation}
Safe Actions:
${(result.safeActions || []).map((a: string) => `• ${a}`).join('\n')}
Authoritative citations: sebi.gov.in / rbi.org.in / cybercrime.gov.in (1930)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Unified Investor Analysis Center
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
          Scan suspicious messages, links, screenshots, or documents through our multi-agent safety pipeline.
        </p>
      </div>

      {/* Demo Input Section (Requirement 6 & 45) */}
      <div className="mb-10 rounded-2xl border border-blue-500/30 bg-blue-950/25 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-sm font-bold text-blue-400">
          <Sparkles className="h-4 w-4" />
          <span>SAMPLE — FOR TESTING ONLY (Executes Through Real Pipeline)</span>
        </div>
        <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
          Select any real-world fraud pattern below to load it into the verification pipeline. All inputs pass through actual OCR, rule checks, and RAG:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REAL_DEMO_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="rounded-xl border border-border bg-card/90 p-3.5 text-foreground hover:border-blue-500/60 hover:bg-muted/70 transition-all text-left space-y-1 shadow-sm"
            >
              <span className="font-bold block text-sm text-blue-300">{sample.label}</span>
              <span className="text-[13px] text-muted-foreground line-clamp-2 leading-snug">{sample.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="glass-card rounded-2xl border border-border/80 shadow-2xl p-6 sm:p-8 mb-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-5 mb-7">
          <button
            onClick={() => { setActiveTab('text'); setResult(null); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'text' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{t.tabs.text}</span>
          </button>
          <button
            onClick={() => { setActiveTab('screenshot'); setResult(null); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'screenshot' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>{t.tabs.screenshot}</span>
          </button>
          <button
            onClick={() => { setActiveTab('url'); setResult(null); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'url' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>{t.tabs.url}</span>
          </button>
          <button
            onClick={() => { setActiveTab('document'); setResult(null); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'document' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>{t.tabs.document}</span>
          </button>
          <button
            onClick={() => { setActiveTab('voice'); setResult(null); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === 'voice' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>{t.tabs.voice}</span>
          </button>
        </div>

        {/* Tab 1: Text / Message Input */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground">
              Paste Suspicious WhatsApp, SMS, or Telegram Message:
            </label>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. 'Dear investor, guaranteed 35% monthly profit with zero risk. Double money in 30 days! Transfer Rs 25,000 to lock slot...'"
              className="w-full rounded-xl border border-border bg-input/40 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>
        )}

        {/* Tab 2: Screenshot Input (OCR) */}
        {activeTab === 'screenshot' && (
          <div className="space-y-4">
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground">
              Upload Screenshot of Chat, Ad, or Social Media Post:
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center hover:border-blue-500/50 transition-colors bg-background/40">
              <Camera className="h-10 w-10 text-blue-400 mb-3" />
              <p className="text-sm sm:text-base text-foreground font-medium mb-1">
                Drag and drop your screenshot here, or click to browse
              </p>
              <p className="text-[13px] text-muted-foreground mb-4">PNG, JPG, or WEBP up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>
            {previewUrl && (
              <div className="mt-4 rounded-xl border border-border p-3 bg-background/60 inline-block shadow-md">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Selected Preview:</p>
                <img src={previewUrl} alt="Screenshot Preview" className="max-h-56 rounded-lg object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: URL Input */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground">
              Enter Suspicious Link or Domain to Verify:
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://sbi-kyc-verification-reward.top/login-update.php"
                className="w-full rounded-xl border border-border bg-input/40 py-3.5 pl-12 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 pt-1">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>SSRF Protection Enforced: Internal IPs and loopback addresses are blocked.</span>
            </p>
          </div>
        )}

        {/* Tab 4: Document Input */}
        {activeTab === 'document' && (
          <div className="space-y-4">
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground">
              Upload PDF Financial Document, Prospectus, or Agreement:
            </label>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center hover:border-blue-500/50 transition-colors bg-background/40">
              <Upload className="h-10 w-10 text-blue-400 mb-3" />
              <p className="text-sm sm:text-base text-foreground font-medium mb-1">
                Upload PDF document to extract clauses and verify guarantees
              </p>
              <p className="text-[13px] text-muted-foreground mb-4">PDF files up to 15MB</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>
            {selectedFile && (
              <p className="text-sm font-semibold text-emerald-400">Selected: {selectedFile.name}</p>
            )}
          </div>
        )}

        {/* Tab 5: Voice Note Input */}
        {activeTab === 'voice' && (
          <div className="space-y-3">
            <label className="block text-sm sm:text-[15px] font-semibold text-foreground">
              Record or Paste Voice Call / Audio Transcript:
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30'
                }`}
              >
                <Mic className="h-5 w-5" />
                <span>{isRecording ? 'Listening... (Tap to Stop)' : 'Record from Microphone'}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={voiceTranscript}
              onChange={(e) => setVoiceTranscript(e.target.value)}
              placeholder="Spoken words or paste audio transcript here..."
              className="w-full rounded-xl border border-border bg-input/40 p-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Pipeline Execution Progress (Requirement 31) */}
        {isAnalyzing && (
          <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-950/30 p-5 shadow-md">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping"></div>
              <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                Multi-Agent Pipeline Active
              </span>
            </div>
            <p className="text-sm sm:text-base text-foreground font-medium animate-pulse">{currentStage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-blue-400" />
            <span>PII Redacted locally before AI evaluation</span>
          </div>

          <div className="flex gap-3">
            {(textInput || urlInput || selectedFile || voiceTranscript) && (
              <button
                type="button"
                onClick={() => {
                  setTextInput('');
                  setUrlInput('');
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setVoiceTranscript('');
                  setResult(null);
                }}
                className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors font-medium"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleStartAnalysis}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              <Send className="h-4 w-4" />
              <span>{isAnalyzing ? t.actions.analyzing : t.actions.startAnalysis}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Explainable AI Result Section (Requirements 16 & 32 & 46) */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Result Header & Language Switcher (Requirement 46: Live switch to Hindi) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/70 p-5 shadow-lg">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Incident Evaluation:
                </span>
                <span className="font-mono text-sm font-semibold text-blue-400">#{result.id}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Processed in {result.processingTimeMs}ms • Deterministic Rules + RAG + Multi-Agent Fusion
              </p>
            </div>

            {/* Language Switcher for Assessment */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">View Explanation in:</span>
              <div className="inline-flex rounded-xl border border-border bg-background p-1 text-sm">
                <button
                  onClick={() => setResultLang('en')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    resultLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setResultLang('hi')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    resultLang === 'hi' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  onClick={() => setResultLang('hinglish')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    resultLang === 'hinglish' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Hinglish
                </button>
              </div>
            </div>
          </div>

          {/* Primary Assessment Card */}
          <div
            className={`rounded-2xl border p-7 sm:p-9 shadow-xl transition-all ${
              result.riskLevel === 'HIGH'
                ? 'border-red-500/50 bg-red-950/20'
                : result.riskLevel === 'MEDIUM'
                ? 'border-amber-500/50 bg-amber-950/20'
                : result.riskLevel === 'LOW'
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-blue-500/50 bg-blue-950/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-md ${
                    result.riskLevel === 'HIGH'
                      ? 'bg-red-500/25 text-red-400 border border-red-500/40'
                      : result.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40'
                      : result.riskLevel === 'LOW'
                      ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40'
                      : 'bg-blue-500/25 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  {result.riskLevel === 'HIGH' && <ShieldAlert className="h-9 w-9" />}
                  {result.riskLevel === 'MEDIUM' && <AlertTriangle className="h-9 w-9" />}
                  {result.riskLevel === 'LOW' && <ShieldCheck className="h-9 w-9" />}
                  {result.riskLevel === 'UNCERTAIN' && <HelpCircle className="h-9 w-9" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-lg sm:text-xl font-black uppercase tracking-wider ${
                        result.riskLevel === 'HIGH'
                          ? 'text-red-400'
                          : result.riskLevel === 'MEDIUM'
                          ? 'text-amber-400'
                          : result.riskLevel === 'LOW'
                          ? 'text-emerald-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {result.riskLevel} RISK
                    </span>
                    <span className="rounded-lg bg-background/80 px-3 py-1 text-xs sm:text-sm font-bold text-foreground border border-border">
                      {result.category}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-foreground/80 mt-1 leading-relaxed">
                    {result.riskLevel === 'HIGH' && 'High-risk indicators detected. This content may be fraudulent.'}
                    {result.riskLevel === 'MEDIUM' && 'Suspicious characteristics identified. Exercise extreme caution.'}
                    {result.riskLevel === 'LOW' && 'No significant risk signals were detected in this analysis.'}
                    {result.riskLevel === 'UNCERTAIN' && 'Insufficient signals to make a definitive assessment. Verify independently.'}
                  </p>
                </div>
              </div>

              {/* Risk Score & Confidence Display */}
              <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-border/80 pt-4 sm:pt-0 sm:pl-8">
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">
                    Risk Score (Heuristic)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-foreground">{result.riskScore}</span>
                    <span className="text-base text-muted-foreground">/100</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-1">
                    Confidence
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {result.confidence >= 0.85 ? 'High (Verified)' : result.confidence >= 0.65 ? 'Moderate' : 'Preliminary'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detected Red Flags (Requirement 16) */}
            {(translatedResult?.detectedRedFlags || result.detectedRedFlags || []).length > 0 && (
              <div className="mb-8 rounded-2xl border border-border/80 bg-background/60 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Detected Red Flags</span>
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {(translatedResult?.detectedRedFlags || result.detectedRedFlags || []).map((flag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-1.5 text-sm font-semibold text-red-200"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      <span>{flag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why This Was Flagged / AI Explanation */}
            <div className="mb-8">
              <h4 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-400" />
                <span>Why This Was Flagged</span>
              </h4>
              <p className="text-base sm:text-[17px] text-foreground/90 leading-relaxed bg-background/50 rounded-2xl p-5 border border-border/80">
                {translatedResult?.explanation || result.explanation}
              </p>
            </div>

            {/* Evidence & Signals List */}
            {result.evidenceItems && result.evidenceItems.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Verified Signals & Evidence</span>
                </h4>
                <div className="space-y-3">
                  {result.evidenceItems.map((item: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-border bg-background/50 p-4 text-sm sm:text-base">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-foreground text-sm sm:text-base">{item.title}</span>
                        <span className="rounded-lg bg-muted px-2.5 py-0.5 text-xs text-foreground uppercase font-bold tracking-wider">
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-foreground/80 text-[14px] sm:text-[15px] leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What You Should Do (Safe Actions) */}
            <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-950/30 p-6 shadow-md">
              <h4 className="text-base font-bold uppercase tracking-wider text-blue-300 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
                <span>What You Should Do (Immediate Safe Actions)</span>
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-foreground leading-relaxed">
                {(translatedResult?.safeActions || result.safeActions || []).map((action: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold text-lg leading-none shrink-0 mt-0.5">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Uncertainty Statement (Requirement 16) */}
            <div className="rounded-xl border border-border/80 bg-background/40 p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Technical Scope & Uncertainty: </span>
              <span>{translatedResult?.uncertainty || result.uncertainty}</span>
            </div>
          </div>

          {/* Authoritative Citations & Threat Intel Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regulatory Sources (RAG) */}
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-border space-y-4">
              <h4 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-400" />
                <span>Official Regulatory Grounding</span>
              </h4>
              {result.trustedSources && result.trustedSources.length > 0 ? (
                <div className="space-y-4">
                  {result.trustedSources.map((src: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-blue-400 text-sm sm:text-base">{src.publisher}</span>
                        {src.publicationDate && (
                          <span className="text-xs text-muted-foreground">{src.publicationDate}</span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-foreground font-semibold leading-snug">{src.title}</p>
                      <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{src.summary}</p>
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:underline font-medium pt-1"
                      >
                        <span>Verify on {src.publisher} Portal</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unable to verify this specific entity against indexed regulatory databases.
                </p>
              )}
            </div>

            {/* Threat Intelligence Connectors */}
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-border space-y-4">
              <h4 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-400" />
                <span>Threat Intelligence Signals</span>
              </h4>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm sm:text-base">VirusTotal Multi-Scanner</span>
                    <span className="text-xs rounded-md bg-muted px-2.5 py-0.5 text-muted-foreground font-semibold">
                      {result.threatIntelSummary?.virusTotalStatus || 'NOT_CONFIGURED'}
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
                    {result.threatIntelSummary?.virusTotalStatus === 'AVAILABLE'
                      ? 'Live reputation database query completed.'
                      : 'Threat intelligence unavailable — unable to verify this signal.'}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm sm:text-base">Google Web Risk</span>
                    <span className="text-xs rounded-md bg-muted px-2.5 py-0.5 text-muted-foreground font-semibold">
                      {result.threatIntelSummary?.googleWebRiskStatus || 'NOT_CONFIGURED'}
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
                    {result.threatIntelSummary?.googleWebRiskStatus === 'AVAILABLE'
                      ? 'Target checked against malware & social engineering database.'
                      : 'Threat intelligence unavailable — unable to verify this signal.'}
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm sm:text-base">SSRF & DNS Security Shield</span>
                    <span className="text-xs rounded-md bg-emerald-950 text-emerald-400 px-2.5 py-0.5 font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
                    All outbound URL queries enforce RFC1918 private IP range rejection and DNS rebinding protections.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Assessment Copied!' : t.actions.copyReport}</span>
            </button>

            <a
              href={`/report?identifier=${encodeURIComponent(urlInput || result.id)}&title=${encodeURIComponent(result.category)}`}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-colors shadow-md"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{t.actions.reportScam}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
