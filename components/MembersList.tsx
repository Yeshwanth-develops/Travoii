"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../lib/useSocket";

export default function MembersList({ tripId }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { socket, joinTrip } = useSocket();

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/trip/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId }),
      });

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    joinTrip(tripId);
  }, [tripId, joinTrip]);

  // Listen for real-time member updates
  useEffect(() => {
    if (!socket) return;

    const handleMemberInvited = () => {
      console.log('Member invited, refreshing list...');
      fetchMembers();
    };

    socket.on('member-invited', handleMemberInvited);

    return () => {
      socket.off('member-invited', handleMemberInvited);
    };
  }, [socket]);

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">Members</h4>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-500">No members yet</p>
      ) : (
        <div className="space-y-1">
          {members.map((m: any) => (
            <div
              key={m._id}
              className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg"
            >
              <span className="text-sm text-gray-700">
                {m.userEmail}
              </span>
              <span className="text-xs text-gray-500">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}