"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, Lock, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form name from session user name when loaded
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Protect client side
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    // If changing password, validate new password match
    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Please fill out all password fields to change your password.");
        setSubmitting(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        setSubmitting(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccess(data.message || "Profile updated successfully!");
      
      // Update next-auth session local cache
      await update({ name });

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#fdf7fb_45%,#f4f9ff_100%)] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-sky-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_60px_-32px_rgba(94,203,255,0.35)] backdrop-blur-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Update your personal details, email address, and security credentials.
            </p>
          </div>

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-4 text-sm text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || ""}
                  className="w-full rounded-2xl border border-sky-100 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-500 shadow-sm outline-none cursor-not-allowed"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Your email is used for authentication and trip invitations and cannot be changed.
              </p>
            </div>

            {/* Profile Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <hr className="border-sky-50" />

            {/* Password section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Security</h3>
              <p className="text-xs text-slate-400 mb-4">
                Leave these blank if you do not want to change your password.
              </p>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
