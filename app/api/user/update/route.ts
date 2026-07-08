import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, currentPassword, newPassword } = await req.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name if provided and different
    if (name && name.trim() !== "" && name !== user.name) {
      user.name = name.trim();
    }

    // Change password if provided
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
