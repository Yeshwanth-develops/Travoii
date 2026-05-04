import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startLocation: String,
    endLocation: String,
    stops: [String],

    startDate: Date,
    endDate: Date,

    budget: Number,

    archived: { type: Boolean, default: false },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);