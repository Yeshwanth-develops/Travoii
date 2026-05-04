"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";

interface AccountMenuProps {
  userName: string;
  fullName: string;
}

export function AccountMenu({ userName, fullName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[100] overflow-visible" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-left transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
          {userName.charAt(0)}
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Welcome back
          </p>
          <p className="text-sm font-semibold text-slate-900">{fullName}</p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[9999] mt-3 min-w-[240px] rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(72,162,255,0.35)]">
          <div className="space-y-1 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Account
            </p>
            <p className="text-sm font-semibold text-slate-900">{fullName}</p>
          </div>

          <div className="border-t border-slate-100" />

          <Link
            href="/account"
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <Settings className="h-4 w-4 text-slate-500" />
            Account Settings
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4 text-slate-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}