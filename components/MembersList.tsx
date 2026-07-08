"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../lib/useSocket";

interface MemberType {
  _id: string;
  userEmail: string;
  role: string;
}

interface MembersListProps {
  tripId: string;
}

export default function MembersList({ tripId }: MembersListProps) {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [loading, setLoading] = useState(true);

  const { socket, joinTrip } = useSocket();

  const fetchMembers = useCallback(async () => {
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
  }, [tripId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
    joinTrip(tripId);
  }, [tripId, joinTrip, fetchMembers]);

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
  }, [socket, fetchMembers]);

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">Members</h4>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-500">No members yet</p>
      ) : (
        <div className="space-y-1">
          {members.map((m) => (
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