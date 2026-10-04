'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { User, ShieldCheck, Mail, Calendar, LogOut, Trash2, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isLoadingUser } = useApp();

  if (isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-dashed border-border p-8">
          <User className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h2 className="text-base font-bold text-foreground mb-1">Not Signed In</h2>
          <p className="text-xs text-muted-foreground mb-6">
            Sign in or register an account to access persistent historical audit records across devices.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center text-2xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{user.email}</span>
            </p>
            <span className="inline-block mt-2 rounded bg-blue-600/20 text-blue-300 px-2 py-0.5 text-[10px] font-semibold uppercase">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <h3 className="font-bold text-foreground mb-1">Data & Privacy Protections</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Your account enforces strict privacy-by-design standards. Analysis records are private to your session, and sensitive credentials (such as Aadhaar, PAN, OTP, and passwords) are redacted prior to external AI evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:underline"
            >
              <span>View Analysis History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
