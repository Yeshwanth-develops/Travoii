import { connectDB } from "@/lib/db";
import Itinerary from "@/models/Itinerary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { tripId } = await req.json();

    const itinerary = await Itinerary.findOne({ tripId });

    return new Response(JSON.stringify(itinerary), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error fetching itinerary" }),
      { status: 500 }
    );
  }
}