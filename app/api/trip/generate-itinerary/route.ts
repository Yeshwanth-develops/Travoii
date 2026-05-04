import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import Itinerary from "@/models/Itinerary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { tripId } = await req.json();
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return new Response("Trip not found", { status: 404 });
    }

    const existingItinerary = await Itinerary.findOne({ tripId });
    if (existingItinerary) {
      return new Response(JSON.stringify(existingItinerary), { status: 200 });
    }

    const defaultBudget = Number(trip.budget) || 300;
    const defaultDays = [
      {
        day: 1,
        activities: [
          `Arrive in ${trip.endLocation}`,
          `Explore the local area and nearby attractions`,
          `Enjoy dinner at a popular local restaurant`,
        ],
        estimatedCost: Math.max(100, Math.round(defaultBudget * 0.2)),
      },
      {
        day: 2,
        activities: [
          `Visit key landmarks in ${trip.endLocation}`,
          `Try local cuisine for lunch`,
          `Relax with an evening activity or show`,
        ],
        estimatedCost: Math.max(100, Math.round(defaultBudget * 0.25)),
      },
      {
        day: 3,
        activities: [
          `Take a morning excursion or short day trip`,
          `Shop for souvenirs and local gifts`,
          `Prepare for departure from ${trip.endLocation}`,
        ],
        estimatedCost: Math.max(100, Math.round(defaultBudget * 0.2)),
      },
    ];

    const itinerary = await Itinerary.create({
      tripId,
      days: defaultDays,
    });

    return new Response(JSON.stringify(itinerary), { status: 200 });
  } catch (err: any) {
    console.error("Itinerary ERROR:", err.message || err);
    return new Response(
      JSON.stringify({
        error: "Error generating itinerary",
        details: err.message || err,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}