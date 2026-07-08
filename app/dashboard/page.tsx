import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import User from "@/models/User";
import mongoose from "mongoose";
import TripsList from "@/app/dashboard/TripsList";
import { AccountMenu } from "./AccountMenu";

import {
  MapPinned,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Plus,
} from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const trips = await Trip.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "tripId",
        as: "members"
      }
    },
    {
      $match: {
        $or: [
          { createdBy: new mongoose.Types.ObjectId(session.user.id) },
          { "members.userEmail": session.user.email }
        ]
      }
    }
  ]);

  const tripCount = trips.length;
  const totalBudget = trips.reduce(
    (sum, trip) => sum + (trip.budget || 0),
    0
  );
  const budgetLabel = totalBudget >= 1000
    ? `₹${(totalBudget / 1000).toFixed(totalBudget % 1000 === 0 ? 0 : 1)}K`
    : `₹${totalBudget}`;

  const groupMembersCount = await User.countDocuments();

  const userName = session.user?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#fdf7fb_45%,#f4f9ff_100%)] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="relative z-50 mb-8 rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_18px_50px_-30px_rgba(72,162,255,0.28)] backdrop-blur-xl overflow-visible">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-md">
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Travoii
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Smart trip planning for your group adventures.
                </p>
              </div>
            </div>

            <AccountMenu userName={userName} fullName={session.user?.name || "Traveler"} />
          </div>
        </header>

        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(223,244,255,0.95)_0%,rgba(255,244,250,0.92)_48%,rgba(232,245,255,0.96)_100%)] p-8 shadow-[0_24px_80px_-36px_rgba(94,203,255,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Travel smarter with your crew
              </div>

              <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Plan, manage, and track every trip in one beautiful workspace.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Organize destinations, budgets, and group updates without losing
                track of the details. Keep every adventure structured from idea
                to takeoff.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/create-trip"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#59c8ff_0%,#6f9fff_55%,#ff96c4_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/80 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  Create New Trip
                </Link>

                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <MapPinned className="h-4 w-4 text-sky-600" />
                  Explore Trips
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  Ready to plan
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your dashboard is set up for trip collaboration.
                </p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Next step
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  Create your itinerary
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Add destinations, budgets, and invite your group.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Trips</span>
              <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
                <Plane className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{tripCount.toString().padStart(2, '0')}</p>
            <p className="mt-1 text-sm text-slate-500">
              Planned adventures so far
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Group Members
              </span>
              <div className="rounded-xl bg-pink-50 p-2 text-pink-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{groupMembersCount}</p>
            <p className="mt-1 text-sm text-slate-500">
              Friends collaborating across trips
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Budget</span>
              <div className="rounded-xl bg-sky-50 p-2 text-sky-700">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{budgetLabel}</p>
            <p className="mt-1 text-sm text-slate-500">
              Combined planned spending
            </p>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Your Trips
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage all your travel plans in one place.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-sky-50/60"
                >
                  View All Trips
                </Link>

                <Link
                  href="/create-trip"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              
              <TripsList limit={3} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Account Security
              </h2>
              <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                <div className="rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Authentication active
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Your account is protected and your session is secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#dff5ff_0%,#fce7f3_100%)] p-6 shadow-[0_20px_50px_-28px_rgba(94,203,255,0.45)]">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Collaborate faster by inviting friends and building your next
                shared travel plan.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-sky-50">
                  Invite Friends
                </button>
                <Link
                  href="/create-trip"
                  className="rounded-2xl bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  Start Planning
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}