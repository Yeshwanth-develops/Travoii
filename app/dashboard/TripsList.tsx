"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Archive, MapPin, Wallet, RefreshCw } from "lucide-react";
import InviteBox from "../../components/InviteBox";
import MembersList from "../../components/MembersList";
import ItineraryBox from "../../components/ItineraryBox";
import { useSocket } from "../../lib/useSocket";

interface Trip {
  _id: string;
  title: string;
  startLocation: string;
  endLocation: string;
  budget: number;
  stops?: string[];
  archived?: boolean;
}

interface TripsListProps {
  layout?: "dashboard" | "grid";
  limit?: number;
}

export default function TripsList({
  layout = "dashboard",
  limit,
}: TripsListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [refreshCount, setRefreshCount] = useState(0);

  const { socket, isConnected, joinTrip } = useSocket();

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trip/get", {
        cache: "no-store",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Unable to load trips.");
      }

      const data: Trip[] = await res.json();
      setTrips(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load trips.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Join all trip rooms for real-time updates
  useEffect(() => {
    if (isConnected && socket) {
      trips.forEach((trip) => {
        joinTrip(trip._id);
      });
    }
  }, [trips, isConnected, socket, joinTrip]);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleMemberInvited = (data: { email: string }) => {
      console.log('Member invited:', data.email);
      // Optionally show a notification or refresh data
      loadTrips();
    };

    socket.on('member-invited', handleMemberInvited);

    return () => {
      socket.off('member-invited', handleMemberInvited);
    };
  }, [socket, loadTrips]);

  const [generatingTripId, setGeneratingTripId] = useState<string | null>(null);

  const handleArchiveToggle = async (id: string) => {
    const trip = trips.find((t) => t._id === id);
    if (!trip) return;

    const newArchived = !trip.archived;

    // Optimistically update local state
    setTrips((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, archived: newArchived } : t
      )
    );

    try {
      const res = await fetch("/api/trip/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, archived: newArchived }),
      });

      if (!res.ok) {
        throw new Error("Failed to update trip");
      }
    } catch (error) {
      console.error("Error archiving trip:", error);
      // Revert local state on error
      setTrips((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, archived: trip.archived } : t
        )
      );
      setError("Failed to archive trip. Please try again.");
    }
  };

  const handleGenerateItinerary = async (id: string) => {
    setGeneratingTripId(id);

    try {
      const res = await fetch("/api/trip/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId: id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to generate itinerary.");
      }

      alert("Itinerary Generated!");
    } catch (error) {
      console.error("Itinerary generation failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate itinerary. Please try again."
      );
    } finally {
      setGeneratingTripId(null);
    }
  };

  const filteredTrips = useMemo(() => {
    const scoped =
      activeTab === "active"
        ? trips.filter((trip) => !trip.archived)
        : trips.filter((trip) => trip.archived);

    return limit ? scoped.slice(0, limit) : scoped;
  }, [trips, activeTab, limit]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="h-11 w-32 animate-pulse rounded-2xl bg-sky-100" />
          <div className="h-11 w-36 animate-pulse rounded-2xl bg-pink-100" />
        </div>

        <div
          className={
            layout === "grid"
              ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }
        >
          {Array.from({ length: layout === "grid" ? 6 : 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-sky-100 bg-white/80 p-6 shadow-sm animate-pulse"
            >
              <div className="mb-4 h-5 w-28 rounded-full bg-sky-100" />
              <div className="mb-3 h-6 w-40 rounded-full bg-slate-100" />
              <div className="mb-3 h-4 w-48 rounded-full bg-slate-100" />
              <div className="mb-4 h-4 w-24 rounded-full bg-pink-100" />
              <div className="h-10 w-28 rounded-2xl bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  const activeCount = trips.filter((trip) => !trip.archived).length;
  const archivedCount = trips.filter((trip) => trip.archived).length;

  const tabs = (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveTab("active")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "active"
              ? "bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] text-white shadow-md"
              : "border border-sky-100 bg-white/80 text-slate-600 hover:bg-sky-50"
          }`}
        >
          Active Trips ({activeCount})
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "archived"
              ? "bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] text-white shadow-md"
              : "border border-sky-100 bg-white/80 text-slate-600 hover:bg-pink-50"
          }`}
        >
          Archived Trips ({archivedCount})
        </button>
      </div>

      <button
        onClick={() => loadTrips()}
        disabled={loading}
        className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 disabled:opacity-50"
        title="Refresh trips list"
      >
        <RefreshCw className={`h-4 w-4 inline mr-2 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );

  const emptyState = (
    <div className="rounded-[32px] border border-dashed border-sky-200 bg-white/75 p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#def4ff_0%,#ffe6f2_100%)] text-sky-700 shadow-sm">
        <Archive className="h-6 w-6" />
      </div>
      <p className="text-lg font-semibold text-slate-900">
        {activeTab === "archived" ? "No archived trips" : "No active trips"}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        {activeTab === "archived"
          ? "Archived trips will appear here."
          : "Create your first trip to start planning your next adventure."}
      </p>
    </div>
  );

  const renderTripCard = (trip: Trip) => (
    <div
      key={trip._id}
      className="h-full min-w-0 rounded-[30px] border border-sky-100 bg-white/85 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-24px_rgba(94,203,255,0.45)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          {trip.archived ? "Archived" : "Adventure"}
        </span>

        <button
          onClick={() => handleArchiveToggle(trip._id)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-white text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
          title={trip.archived ? "Unarchive trip" : "Archive trip"}
          aria-label={trip.archived ? "Unarchive trip" : "Archive trip"}
        >
          <Archive className="h-4 w-4" />
        </button>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        {trip.title}
      </h3>

      <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
        <p className="leading-6">
          {trip.startLocation} <span className="text-sky-500">→</span> {trip.endLocation}
        </p>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#e0f5ff_0%,#ffe6f2_100%)] px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm">
        <Wallet className="h-4 w-4 text-sky-700" />
        Budget: ₹{trip.budget}
      </div>

      {trip.stops && trip.stops.length > 0 ? (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Stops
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
        <p className="mt-5 text-sm text-slate-500">No extra stops added yet.</p>
      )}

      <button
        onClick={() => handleGenerateItinerary(trip._id)}
        disabled={generatingTripId === trip._id}
        className="mt-5 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {generatingTripId === trip._id ? "Generating…" : "Generate Itinerary"}
      </button>

      <InviteBox tripId={trip._id} />
      <MembersList tripId={trip._id} />
      <ItineraryBox tripId={trip._id} />
    </div>
  );

  if (layout === "grid") {
    return (
      <div className="w-full">
        {tabs}
        {filteredTrips.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredTrips.map(renderTripCard)}
          </div>
        ) : (
          emptyState
        )}
      </div>
    );
  }

  return (
    <div>
      {tabs}
      {filteredTrips.length > 0 ? (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="min-w-0 rounded-[28px] border border-sky-100 bg-white/85 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-22px_rgba(94,203,255,0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{trip.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {trip.startLocation} <span className="text-sky-500">→</span> {trip.endLocation}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Budget: ₹{trip.budget}
                  </p>
                  <button
                    onClick={() => handleGenerateItinerary(trip._id)}
                    disabled={generatingTripId === trip._id}
                    className="mt-4 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {generatingTripId === trip._id ? "Generating…" : "Generate Itinerary"}
                  </button>
                </div>

                <button
                  onClick={() => handleArchiveToggle(trip._id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-white text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                  title={trip.archived ? "Unarchive trip" : "Archive trip"}
                  aria-label={trip.archived ? "Unarchive trip" : "Archive trip"}
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        emptyState
      )}
    </div>
  );
}