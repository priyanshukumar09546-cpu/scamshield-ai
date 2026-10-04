'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { ShieldCheck, Globe, User, LogOut, LayoutDashboard, Menu, X, AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '@/lib/i18n/translations';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.navigation.home },
    { href: '/check', label: t.navigation.check },
    { href: '/history', label: t.navigation.history },
    { href: '/learn', label: t.navigation.learn },
    { href: '/report', label: t.navigation.report },
    { href: '/dashboard', label: t.navigation.dashboard },
  ];

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-xl text-foreground">ScamShield</span>
              <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground hidden sm:block">Investor Protection & Fraud Verification</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Tools: Language Selector + Auth */}
        <div className="flex items-center gap-3.5">
          {/* Language Selector */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 text-blue-400" />
            <select
              value={language}
              onChange={handleLangChange}
              className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer font-medium"
              aria-label="Select language"
            >
              <option value="en" className="bg-slate-900 text-foreground">English</option>
              <option value="hi" className="bg-slate-900 text-foreground">हिंदी (Hindi)</option>
              <option value="hinglish" className="bg-slate-900 text-foreground">Hinglish</option>
            </select>
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="rounded-xl p-2 text-muted-foreground hover:text-destructive hover:bg-muted/40 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              {t.navigation.login}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
