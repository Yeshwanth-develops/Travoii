import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import Member from "@/models/Member";
import Itinerary from "@/models/Itinerary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import TripDetailsClient from "./TripDetailsClient";

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  await connectDB();

  const trip = await Trip.findById(id);
  if (!trip) {
    notFound();
  }

  // Verify access: user must be the creator OR a member of the trip
  const isCreator = trip.createdBy && trip.createdBy.toString() === session.user.id;
  const isMember = await Member.findOne({
    tripId: trip._id,
    userEmail: session.user.email,
  });

  if (!isCreator && !isMember) {
    redirect("/dashboard");
  }

  // Check if itinerary exists
  const existingItinerary = await Itinerary.findOne({ tripId: trip._id });
  
  // Serialize trip for client component
  const serializedTrip = {
    _id: trip._id.toString(),
    title: trip.title,
    startLocation: trip.startLocation || "",
    endLocation: trip.endLocation || "",
    stops: trip.stops || [],
    budget: trip.budget || 0,
    hasItinerary: !!existingItinerary,
  };

  return <TripDetailsClient trip={serializedTrip} />;
}
