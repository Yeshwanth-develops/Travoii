"use client";

import { useState } from "react";
import { useSocket } from "../lib/useSocket";

interface InviteBoxProps {
  tripId: string;
}

export default function InviteBox({ tripId }: InviteBoxProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { inviteMember } = useSocket();

  const handleInvite = async () => {
    if (!email) {
      setMessage("Please enter an email.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/trip/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, tripId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Invitation sent!");
        setEmail("");

        // Emit real-time update to other users in the trip
        inviteMember(tripId, email);
      } else {
        setMessage(data.error || "❌ Failed to invite.");
      }
    } catch {
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-4 space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Invite Member
      </label>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleInvite}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {loading ? "..." : "Invite"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}