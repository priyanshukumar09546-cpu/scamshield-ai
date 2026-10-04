import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/60 pb-24 md:pb-12 pt-14 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Statutory Guardrail Disclaimer */}
        <div className="mb-12 rounded-2xl border border-blue-500/30 bg-blue-950/30 p-6 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2.5 text-blue-400 font-bold mb-2 text-base">
            <Lock className="h-5 w-5" />
            <span>Statutory Investor Safety Guardrail</span>
          </div>
          <p className="text-[15px] sm:text-base text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            ScamShield AI provides risk awareness, linguistic scam pattern detection, and regulatory verification support — 
            <strong className="text-foreground font-semibold"> strictly not financial or investment advice</strong>. The platform never predicts stock prices, 
            never gives buy/sell/hold recommendations, and never promotes financial brokers or speculative instruments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
              <span>ScamShield AI</span>
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              “Before You Trust It, Verify It.” AI-powered investor defense against digital financial scams, phishing, and fake investment schemes.
            </p>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Intelligence Systems Operational</span>
            </div>
          </div>

          {/* Verification Authorities */}
          <div>
            <h4 className="font-bold text-foreground text-base mb-4">Verification Authorities</h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  SEBI Regulatory Portal <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                </a>
              </li>
              <li>
                <a href="https://sachet.rbi.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  RBI SACHET Registry <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  National Cyber Crime Portal <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                </a>
              </li>
              <li>
                <a href="https://www.cert-in.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  CERT-In Security Advisories <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Cyber Response */}
          <div>
            <h4 className="font-bold text-foreground text-base mb-4">Emergency Cyber Response</h4>
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 mb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-1.5 text-base">
                <PhoneCall className="h-5 w-5" />
                <span>National Helpline: 1930</span>
              </div>
              <p className="text-sm leading-relaxed text-red-200/90">
                Victims of financial cyber fraud should immediately dial 1930 to freeze stolen funds within the critical golden hour.
              </p>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-bold text-foreground text-base mb-4">Platform Navigation</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link href="/check" className="hover:text-blue-400 transition-colors">Unified Analysis Center</Link></li>
              <li><Link href="/history" className="hover:text-blue-400 transition-colors">Analysis History</Link></li>
              <li><Link href="/learn" className="hover:text-blue-400 transition-colors">Scam Knowledge Base</Link></li>
              <li><Link href="/report" className="hover:text-blue-400 transition-colors">Report Fraud Content</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Live Risk Metrics</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ScamShield AI — Hackathon Track A (Digital Fraud & Scam Resilience).</p>
          <div className="flex gap-6 font-medium">
            <span>Privacy-by-Design</span>
            <span>Deterministic Safety Rules</span>
            <span>Authoritative RAG Grounding</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
