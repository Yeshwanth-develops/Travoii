import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, archived } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
    }

    await connectDB();

    const trip = await Trip.findOneAndUpdate(
      { _id: id, createdBy: new mongoose.Types.ObjectId(session.user.id) },
      { archived },
      { returnDocument: 'after' }
    );

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}