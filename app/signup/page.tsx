"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setLoading(false);

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", password: "" });

        setTimeout(() => {
          router.push("/login?success=Account%20created%20successfully!");
        }, 1500);
      } else {
        const message = await res.text();
        setError(message || "Unable to create account. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef4ff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.95),transparent_18%),radial-gradient(circle_at_85%_18%,rgba(186,230,253,0.95),transparent_20%),radial-gradient(circle_at_82%_80%,rgba(244,114,182,0.16),transparent_20%),linear-gradient(180deg,#edf6ff_0%,#f6f8ff_45%,#f3f6ff_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(circle_at_center,black_35%,transparent_85%)]" />

      <div className="absolute left-[-5rem] top-[10rem] h-[18rem] w-[18rem] rounded-full bg-sky-300/25 blur-3xl animate-[floatSlow_14s_ease-in-out_infinite]" />
      <div className="absolute right-[-4rem] top-[6rem] h-[16rem] w-[16rem] rounded-full bg-pink-300/15 blur-3xl animate-[floatSlow_18s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-5rem] left-[35%] h-[20rem] w-[20rem] rounded-full bg-violet-300/10 blur-3xl animate-[floatSlow_20s_ease-in-out_infinite]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1450px] items-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="group grid w-full overflow-hidden rounded-[2rem] border border-white/50 bg-white/30 shadow-[0_30px_100px_rgba(148,163,184,0.18)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_35px_120px_rgba(148,163,184,0.24)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden min-h-[720px] overflow-hidden lg:flex">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(30,41,59,0.82),rgba(37,99,235,0.35))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(244,114,182,0.12),transparent_24%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_42%,transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative flex h-full w-full flex-col justify-between p-10 text-white">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75 backdrop-blur-md">
                  Join Travoii
                </div>

                <div className="mt-8 max-w-md">
                  <h1 className="text-5xl font-semibold leading-[1] tracking-[-0.06em]">
                    Your next trip starts with one shared space.
                  </h1>
                  <p className="mt-6 max-w-sm text-base leading-7 text-white/72">
                    Create your account, invite your group, and keep plans,
                    bookings, ideas, and schedules beautifully organized.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                  <p className="text-sm font-medium text-white">
                    Plan together without the mess
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Organize flights, stays, places to visit, and group ideas in
                    one calm dashboard.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                    Shared itineraries
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                    Easy collaboration
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                    Elegant planning
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/72 p-8 shadow-[0_25px_80px_rgba(148,163,184,0.18)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(148,163,184,0.22)] sm:p-9">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] opacity-0 transition-opacity duration-700 hover:opacity-100" />

                <div className="relative inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 shadow-sm">
                  Create account
                </div>

                <h2 className="relative mt-6 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
                  Start planning beautifully
                </h2>
                <p className="relative mt-3 text-sm leading-6 text-slate-600">
                  Join Travoii and bring your travel plans, people, and details
                  into one polished workspace.
                </p>

                {error ? (
                  <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 shadow-sm">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
                    ✓ Account created successfully! Redirecting to login...
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Password
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Create a password"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-3 w-full rounded-2xl bg-[linear-gradient(135deg,#ec4899,#8b5cf6,#3b82f6)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(99,102,241,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(59,130,246,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="inline-flex items-center gap-2">
                      {loading ? "Creating account..." : "Create account"}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </form>

                <p className="relative mt-6 text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-slate-900 transition hover:text-sky-700"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}