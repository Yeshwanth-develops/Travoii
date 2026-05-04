"use client";

import { useEffect, useState } from "react";

export default function ItineraryBox({ tripId }: any) {
  const [itinerary, setItinerary] = useState<any>(null);

  const fetchItinerary = async () => {
    const res = await fetch("/api/trip/get-itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripId }),
    });

    const data = await res.json();
    setItinerary(data);
  };

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  if (!itinerary) return null;

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
      <h4 className="font-semibold mb-2">Itinerary</h4>

      {itinerary.days.map((day: any) => (
        <div key={day.day} className="mb-3">
          <h5 className="font-medium">Day {day.day}</h5>

          <ul className="text-sm text-gray-600 ml-4 list-disc">
            {day.activities.map((act: string, i: number) => (
              <li key={i}>{act}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-500">
            Budget: ₹{day.estimatedCost}
          </p>
        </div>
      ))}
    </div>
  );
}