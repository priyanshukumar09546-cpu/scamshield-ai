'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import {
  Clock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Camera,
  Upload,
  Mic,
  RotateCcw,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  inputType: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  confidence: number;
  category: string;
  explanation: string;
  createdAt: string;
  processingTimeMs: number;
}

export default function HistoryPage() {
  const { t, user } = useApp();
  const [records, setRecords] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HistoryItem | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (selectedRecord?.id === id) {
          setSelectedRecord(null);
        }
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to permanently clear your entire analysis history?')) return;
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        setRecords([]);
        setSelectedRecord(null);
      }
    } catch (e) {
      console.error('Clear history error:', e);
    }
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'SCREENSHOT': return <Camera className="h-5 w-5 text-blue-400" />;
      case 'URL': return <LinkIcon className="h-5 w-5 text-indigo-400" />;
      case 'DOCUMENT': return <Upload className="h-5 w-5 text-amber-400" />;
      case 'VOICE': return <Mic className="h-5 w-5 text-rose-400" />;
      default: return <FileText className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Analysis Verification History
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
            Review past scans, audit trails, and identified threat categories.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors self-start sm:self-auto shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t.actions.deleteHistory}</span>
          </button>
        )}
      </div>

      {/* Main Content List / Detail */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-muted-foreground">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-sm sm:text-base">Loading historical records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">No Analysis History Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            You haven’t performed any scans yet. Run your first check through the analysis center.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Start First Analysis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List column */}
          <div className="lg:col-span-2 space-y-4">
            {records.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all hover:border-blue-500/50 shadow-md ${
                  selectedRecord?.id === item.id ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500/40' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-card border border-border">
                      {getInputIcon(item.inputType)}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-foreground leading-snug">{item.category}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()} at{' '}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                        item.riskLevel === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.riskLevel === 'LOW'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {item.riskLevel} ({item.riskScore})
                    </span>
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      title="Delete record"
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>

          {/* Details column */}
          <div className="glass-card rounded-2xl p-6 border border-border h-fit shadow-xl space-y-4">
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Record Details
                  </span>
                  <span className="font-mono text-xs font-semibold text-blue-400">#{selectedRecord.id.substring(0, 12)}</span>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Threat Category:</span>
                    <span className="text-base font-bold text-foreground">{selectedRecord.category}</span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Input Modality:</span>
                    <span className="font-semibold text-foreground">{selectedRecord.inputType}</span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Risk Score:</span>
                    <span className="text-2xl font-black text-foreground">{selectedRecord.riskScore}/100</span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block font-medium mb-1">Safety Summary:</span>
                    <p className="text-sm text-foreground/90 leading-relaxed bg-background/50 p-4 rounded-xl border border-border">
                      {selectedRecord.explanation}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/check`}
                      className="inline-flex items-center gap-2 w-full justify-center rounded-xl bg-blue-600/30 border border-blue-500/40 px-4 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-600/50 transition-colors"
                    >
                      <span>Analyze Similar Content</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm leading-relaxed">Select any historical analysis on the left to view comprehensive details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
