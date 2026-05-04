import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    userEmail: String,
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);