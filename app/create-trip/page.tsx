"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Search, Trash, Wallet } from "lucide-react";

interface LocationSuggestion {
  name: string;
  full_name: string;
}

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
}: LocationInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLocations = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/location/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchLocations, 350);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            onChange(val);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
        />
      </div>

      {open && (results.length > 0 || loading) && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-sky-100 bg-white p-2 shadow-[0_20px_40px_-20px_rgba(94,203,255,0.35)]">
          {loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">Searching locations...</div>
          ) : (
            results.map((item, index) => (
              <button
                key={`${item.full_name}-${index}`}
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-sky-50"
                onClick={() => {
                  setQuery(item.full_name);
                  onChange(item.full_name);
                  setOpen(false);
                }}
              >
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.full_name}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function CreateTrip() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    startLocation: "",
    endLocation: "",
    budget: "",
  });

  const [stops, setStops] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addStop = () => {
    setStops([...stops, ""]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, stopIndex) => stopIndex !== index));
  };

  const updateStop = (value: string, index: number) => {
    const updated = [...stops];
    updated[index] = value;
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/trip/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          stops: stops.filter((stop) => stop.trim() !== ""),
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Error creating trip");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#fdf7fb_45%,#f4f9ff_100%)] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_60px_-32px_rgba(94,203,255,0.35)] backdrop-blur-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create Trip
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Add real locations, stops, and budget details for your next journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Trip Title
              </label>
              <input
                placeholder="Friends Goa Escape"
                className="w-full rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <LocationAutocomplete
              label="Start Location"
              placeholder="Type your departure city"
              value={form.startLocation}
              onChange={(value) =>
                setForm({ ...form, startLocation: value })
              }
            />

            <LocationAutocomplete
              label="Destination"
              placeholder="Type your destination"
              value={form.endLocation}
              onChange={(value) =>
                setForm({ ...form, endLocation: value })
              }
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Stops
                </label>
                <button
                  type="button"
                  onClick={addStop}
                  className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Stop
                </button>
              </div>

              {stops.map((stop, index) => (
                <div key={index} className="relative">
                  <LocationAutocomplete
                    label={`Stop ${index + 1}`}
                    placeholder={`Search stop ${index + 1}`}
                    value={stop}
                    onChange={(value) => updateStop(value, index)}
                  />

                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="absolute right-3 top-12 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove stop ${index + 1}`}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Budget
              </label>
              <div className="relative">
                <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full rounded-2xl border border-sky-100 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  value={form.budget}
                  onChange={(e) =>
                    setForm({ ...form, budget: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#5ecbff_0%,#729cff_55%,#ff97c5_100%)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating Trip..." : "Create Trip"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}