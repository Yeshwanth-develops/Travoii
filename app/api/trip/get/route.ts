import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const trips = await Trip.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "tripId",
          as: "members"
        }
      },
      {
        $match: {
          $or: [
            { createdBy: new mongoose.Types.ObjectId(session.user.id) },
            { "members.userEmail": session.user.email }
          ]
        }
      }
    ]);

    return new Response(JSON.stringify(trips), { 
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Trip fetch error:", err);
    return new Response(
      JSON.stringify({ error: "Error fetching trips" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}