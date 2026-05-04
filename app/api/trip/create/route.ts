import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import Member from "@/models/Member";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    console.log("🔥 CREATE TRIP HIT");

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectDB();
    console.log("✅ DB connected");

    const body = await req.json();
    console.log("📦 Body:", body);

    if (!body.title) {
      throw new Error("Title is required");
    }

    const trip = await Trip.create({
      title: body.title,
      startLocation: body.startLocation || "",
      endLocation: body.endLocation || "",
      stops: Array.isArray(body.stops)
        ? body.stops.filter((stop: string) => stop?.trim() !== "")
        : [],
      budget: Number(body.budget) || 0,
      createdBy: new mongoose.Types.ObjectId(session.user.id),
    });

    console.log("✅ Trip created:", trip);

    // Add the creator as a member with admin role
    await Member.create({
      userEmail: session.user.email,
      tripId: trip._id,
      role: "admin",
    });

    console.log("✅ Creator added as member");

    return new Response(JSON.stringify(trip), { status: 201 });

  } catch (err: any) {
    console.error("🔥 ERROR:", err);
    return new Response(err.message, { status: 500 });
  }
}