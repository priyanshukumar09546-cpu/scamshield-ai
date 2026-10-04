'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, Clock, BookOpen, User } from 'lucide-react';
import { useApp } from '@/components/providers/AppProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { t, user } = useApp();

  const items = [
    { href: '/', label: t.navigation.home, icon: Home },
    { href: '/check', label: t.navigation.check, icon: ShieldAlert },
    { href: '/history', label: t.navigation.history, icon: Clock },
    { href: '/learn', label: t.navigation.learn, icon: BookOpen },
    { href: user ? '/profile' : '/login', label: user ? t.navigation.profile : t.navigation.login, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-border/80 bg-background/95 backdrop-blur-lg md:hidden">
      <div className="grid h-16 grid-cols-5 items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-blue-400 font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
