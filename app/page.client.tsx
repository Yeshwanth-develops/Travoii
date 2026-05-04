"use client";

import Link from "next/link";

export default function HomePageClient() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.22),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(167,139,250,0.18),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#020617)]" />
        <div className="absolute -top-24 left-[-10%] h-72 w-72 animate-[floatCloud_18s_ease-in-out_infinite] rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute top-20 right-[-8%] h-80 w-80 animate-[floatCloud_24s_ease-in-out_infinite] rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute bottom-10 left-[18%] h-64 w-64 animate-[floatCloud_20s_ease-in-out_infinite] rounded-full bg-cyan-200/10 blur-3xl" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 sm:px-10">
        <section className="w-full rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-sky-100/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
                Welcome to Travoii
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
                  Travel planning made elegant for friends, teams, and shared adventures.
                </h1>

                <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  Organize destinations, dates, budgets, and trip ideas in one calm,
                  collaborative workspace designed for modern group travel.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:scale-[1.02] hover:bg-sky-100"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
                >
                  Login
                </Link>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-white">Live</p>
                  <p className="mt-1 text-sm text-slate-300">Collaborative trip planning</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-white">Smart</p>
                  <p className="mt-1 text-sm text-slate-300">Itinerary and budget support</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-white">Fast</p>
                  <p className="mt-1 text-sm text-slate-300">Simple onboarding and dashboard</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-indigo-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Your next trip
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
                      Organize every detail in one place
                    </h2>
                  </div>
                  <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-200">
                    Dashboard
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Secure login and signup flow",
                    "Shared trip dashboard access",
                    "Clean planning experience",
                    "Budgets, dates, and destinations together",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]" />
                      <p className="text-sm text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Upcoming vibe</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    Calm skies, clear plans, better group trips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes floatCloud {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(30px, -12px, 0) scale(1.04);
          }
          50% {
            transform: translate3d(10px, 18px, 0) scale(0.98);
          }
          75% {
            transform: translate3d(-24px, -8px, 0) scale(1.03);
          }
        }
      `}</style>
    </main>
  );
}
