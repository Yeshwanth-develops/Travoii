import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
  days: [
    {
      day: Number,
      activities: [String],
      estimatedCost: Number,
    },
  ],
});

export default mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);