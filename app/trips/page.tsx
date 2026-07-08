import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import TripsList from "@/app/dashboard/TripsList";
import { ArrowLeft, Plus, Plane } from "lucide-react";

export default async function TripsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-md">
                <Plane className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Your Trips
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create-trip"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Create New Trip
            </Link>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              All Your Adventures
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View, edit, and manage all your travel plans.
            </p>
          </div>

          <div className="w-full">
            <TripsList layout="grid" />
          </div>
        </div>
      </div>
    </div>
  );
}