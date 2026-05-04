import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travoii — Collaborative trip planning",
  description:
    "Plan trips with friends, manage itineraries, and access your dashboard quickly.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="absolute inset-0 -z-30 bg-[#f4f8ff]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.96),transparent_18%),radial-gradient(circle_at_82%_14%,rgba(186,230,253,0.9),transparent_20%),radial-gradient(circle_at_78%_82%,rgba(244,114,182,0.14),transparent_22%),radial-gradient(circle_at_48%_50%,rgba(255,255,255,0.42),transparent_40%),linear-gradient(180deg,#edf7ff_0%,#f7f9ff_38%,#f5f8ff_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] bg-size-[72px_72px] opacity-15 [mask-image:radial-gradient(circle_at_center,black_35%,transparent_85%)]" />
      <div className="absolute left-[-6rem] top-[8rem] -z-10 h-[22rem] w-[22rem] animate-[floatSlow_12s_ease-in-out_infinite] rounded-full bg-sky-300/25 blur-[30px]" />
      <div className="absolute right-[-5rem] top-[10rem] -z-10 h-[20rem] w-[20rem] animate-[floatSlow_14s_ease-in-out_infinite_reverse] rounded-full bg-pink-300/15 blur-[30px]" />
      <div className="absolute bottom-[-5rem] left-[35%] -z-10 h-[24rem] w-[24rem] animate-[floatSlow_16s_ease-in-out_infinite] rounded-full bg-violet-300/10 blur-[30px]" />

      <div className="relative">
        <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.18))]" />
            <div className="absolute inset-y-0 right-0 w-px bg-white/70" />

            <div className="relative mx-auto w-full max-w-xl">
              <div className="inline-flex w-fit items-center rounded-full border border-white/60 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-600 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/75 hover:text-slate-800">
                Welcome to Travoii
              </div>

              <div className="mt-8 space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-slate-950 sm:text-6xl lg:text-[6.2rem]">
                  Travoii
                </h1>

                <p className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 transition-all duration-300 hover:translate-x-2 hover:text-sky-950 sm:text-4xl lg:text-5xl">
                  Plan beautiful trips with your crew, without the chaos.
                </p>

                <p className="max-w-xl text-base leading-8 text-slate-600 transition-all duration-300 hover:translate-x-2 hover:text-slate-800 sm:text-lg">
                  Collaborate on itineraries, organize stays and activities, and
                  keep every travel detail in one polished shared workspace.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6,#3b82f6)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(147,51,234,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_18px_44px_rgba(59,130,246,0.42)] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-sky-200/80 bg-white/60 px-7 py-3.5 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/90 hover:text-sky-900 hover:shadow-[0_12px_30px_rgba(56,189,248,0.18)] focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2"
                >
                  Login
                </Link>
              </div>
            </div>
          </section>

          <section className="relative flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,114,182,0.10),rgba(59,130,246,0.12),rgba(168,85,247,0.10))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_30%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.25),transparent_28%)]" />

            <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/25 p-4 shadow-[0_30px_110px_rgba(96,130,180,0.18)] backdrop-blur-3xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/35 bg-slate-950/82 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-7">
                <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                  Your next trip
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                  Organize every detail in one premium space
                </h2>

                <div className="mt-8 grid gap-3">
                  <div className="hover-card">
                    <p className="text-sm font-medium text-white">
                      Collaborative itinerary builder
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Keep destinations, timings, bookings, and ideas synced for
                      everyone.
                    </p>
                  </div>

                  <div className="hover-card hover-card-pink">
                    <p className="text-sm font-medium text-white">
                      Fast dashboard access
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Sign in and continue planning without jumping between
                      scattered tools.
                    </p>
                  </div>

                  <div className="hover-card hover-card-violet">
                    <p className="text-sm font-medium text-white">
                      Clean visual workflow
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Designed to feel calm, modern, and effortless from the
                      first click.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-pink-400/30 bg-pink-400/15 px-4 py-2 text-xs font-medium text-pink-200 transition duration-300 hover:-translate-y-0.5 hover:bg-pink-400/25">
                    Smart planning
                  </span>
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/15 px-4 py-2 text-xs font-medium text-sky-200 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-400/25">
                    Shared access
                  </span>
                  <span className="rounded-full border border-violet-400/30 bg-violet-400/15 px-4 py-2 text-xs font-medium text-violet-200 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-400/25">
                    Elegant experience
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}