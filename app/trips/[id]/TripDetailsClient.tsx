"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, MapPin, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import InviteBox from "@/components/InviteBox";
import MembersList from "@/components/MembersList";
import ItineraryBox from "@/components/ItineraryBox";

interface TripDetailsClientProps {
  trip: {
    _id: string;
    title: string;
    startLocation: string;
    endLocation: string;
    stops?: string[];
    budget: number;
    hasItinerary: boolean;
  };
}

export default function TripDetailsClient({ trip: initialTrip }: TripDetailsClientProps) {
  const [trip, setTrip] = useState(initialTrip);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async (regenerate: boolean) => {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/trip/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId: trip._id, regenerate }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.details || body?.error || "Failed to generate itinerary.");
      }

      setTrip((prev) => ({ ...prev, hasItinerary: true }));
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Failed to generate itinerary.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#fdf7fb_45%,#f4f9ff_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-sky-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_60px_-32px_rgba(94,203,255,0.35)] backdrop-blur-xl">
          <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 mb-4">
            Adventure Planning
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {trip.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-slate-600">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-sky-500" />
              <span>
                {trip.startLocation} <span className="text-sky-500 font-bold">→</span> {trip.endLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Itinerary Section (Left) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-md backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  Trip Itinerary
                </h2>

                {trip.hasItinerary && (
                  <button
                    onClick={() => handleGenerate(true)}
                    disabled={generating}
                    className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${generating ? "animate-spin" : ""}`} />
                    Regenerate AI Plan
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-4 text-sm text-rose-700">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Renders the day-wise itinerary */}
              <div className="mt-4">
                <ItineraryBox tripId={trip._id} key={`${trip._id}-${refreshKey}`} />
              </div>

              {/* Show Generate button if no itinerary exists */}
              {!trip.hasItinerary && (
                <div className="text-center py-10">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-700 shadow-sm">
                    <Sparkles className="h-6 w-6 text-sky-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Itinerary Generated Yet</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                    Let Gemini build a customized, day-by-day travel plan matching your budget and stops.
                  </p>
                  <button
                    onClick={() => handleGenerate(false)}
                    disabled={generating}
                    className="rounded-2xl bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {generating ? "Generating Plan..." : "Generate AI Itinerary"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Section (Right) */}
          <div className="space-y-6">
            {/* Budget & Stops Card */}
            <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-md backdrop-blur-xl space-y-5">
              <h3 className="text-lg font-semibold text-slate-900">Trip Info</h3>

              <div className="flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#e0f5ff_0%,#ffe6f2_100%)] p-4 text-slate-800 shadow-sm">
                <Wallet className="h-5 w-5 text-sky-700 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Budget</p>
                  <p className="text-lg font-bold">₹{trip.budget}</p>
                </div>
              </div>

              {trip.stops && trip.stops.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Route Stops
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trip.stops.map((stop, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700"
                      >
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Direct trip, no stops added.</p>
              )}
            </div>

            {/* Collaboration & Members Card */}
            <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-md backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Group Collaboration</h3>
              <InviteBox tripId={trip._id} />
              <div className="mt-6 border-t border-sky-50 pt-4">
                <MembersList tripId={trip._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
