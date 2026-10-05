'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  Building2,
  PhoneCall,
  Search,
  Lock,
} from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  authority: string;
  officialLink: string;
  redFlags: string[];
  safetyRules: string[];
}

export default function LearnPage() {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [authoritativeSources, setAuthoritativeSources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGuides() {
      try {
        const res = await fetch('/api/learn');
        if (res.ok) {
          const data = await res.json();
          setGuides(data.guides || []);
          setAuthoritativeSources(data.authoritativeSources || []);
        }
      } catch (e) {
        console.error('Failed to load educational content:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGuides();
  }, []);

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Investor Safety & Fraud Education Hub
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
          Authoritative intelligence on emerging cyber fraud typologies grounded in SEBI, RBI, and CERT-In advisories.
        </p>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scam patterns (e.g. 'digital arrest', 'guaranteed returns')..."
            className="w-full rounded-xl border border-border bg-card/90 py-3 pl-12 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="mb-10 rounded-2xl border border-red-500/40 bg-red-950/25 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-red-600/20 p-3 text-red-400 shrink-0">
              <PhoneCall className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Immediate Financial Cyber Fraud Emergency?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">
                Dial national toll-free helpline <strong className="text-red-400 font-bold">1930</strong> or lodge an immediate complaint on{' '}
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-semibold">
                  cybercrime.gov.in
                </a>{' '}
                for immediate financial cyber-fraud assistance and transaction alert routing within the golden hour.
              </p>
            </div>
          </div>
          <a
            href="tel:1930"
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-500 transition-colors whitespace-nowrap self-start sm:self-center"
          >
            Call 1930 Helpline
          </a>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-8 mb-14">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Documented Scam Typologies</h2>

        {filteredGuides.map((guide) => (
          <div key={guide.id} className="glass-card rounded-2xl p-7 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  {guide.category.replace(/_/g, ' ')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{guide.title}</h3>
              </div>
              <a
                href={guide.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:underline font-semibold self-start sm:self-auto"
              >
                <span>{guide.authority}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">{guide.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-5">
              <div className="rounded-xl bg-red-950/20 border border-red-500/25 p-4 space-y-2">
                <h4 className="font-bold text-red-400 flex items-center gap-2 text-sm sm:text-base">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Key Red Flags</span>
                </h4>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {guide.redFlags.map((rf, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-blue-950/20 border border-blue-500/25 p-4 space-y-2">
                <h4 className="font-bold text-blue-300 flex items-center gap-2 text-sm sm:text-base">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>Protective Safety Rules</span>
                </h4>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {guide.safetyRules.map((sr, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>{sr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Verification Resources Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5">Official Verification Databases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <a
            href="https://www.sebi.gov.in/enforcement/unregistered-entities.html"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-2xl p-5 border border-border hover:border-blue-500/50 transition-colors block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">SEBI Unregistered Entities List</span>
              <ExternalLink className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Verify if an investment advisor or portfolio manager has authorized registration under SEBI regulations.
            </p>
          </a>

          <a
            href="https://sachet.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-2xl p-5 border border-border hover:border-blue-500/50 transition-colors block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">RBI SACHET Registry</span>
              <ExternalLink className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Search unauthorized deposit-taking companies, fake loan apps, and unapproved NBFC lending entities.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
