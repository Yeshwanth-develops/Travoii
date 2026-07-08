import { connectDB } from "@/lib/db";
import Member from "@/models/Member";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { tripId } = await req.json();

    const members = await Member.find({ tripId });

    return new Response(JSON.stringify(members), { status: 200 });
  } catch {
    return new Response("Error fetching members", { status: 500 });
  }
}