import { connectDB } from "@/lib/db";
import Member from "@/models/Member";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, tripId } = await req.json();

    if (!email || !tripId) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400 }
      );
    }

    const member = await Member.create({
      userEmail: email,
      tripId,
      role: "member",
    });

    return new Response(JSON.stringify(member), { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new Response("Error inviting member", { status: 500 });
  }
}