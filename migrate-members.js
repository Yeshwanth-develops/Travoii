const mongoose = require("mongoose");

async function migrate() {
  try {
    const MONGODB_URI = "mongodb+srv://yeshwanthsunkara2006_db_user:yesh2006@cluster0.crfwm4h.mongodb.net/?appName=Cluster0";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    const Trip = mongoose.model("Trip", new mongoose.Schema({
      title: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }));

    const Member = mongoose.model("Member", new mongoose.Schema({
      userEmail: String,
      tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
      role: { type: String, default: "member" }
    }));

    const User = mongoose.model("User", new mongoose.Schema({
      email: String,
      name: String
    }));

    const trips = await Trip.find({}).populate("createdBy");
    console.log("Found " + trips.length + " trips");

    for (const trip of trips) {
      if (!trip.createdBy) {
        console.log("Trip " + trip.title + " has no creator, skipping");
        continue;
      }

      const existingMember = await Member.findOne({
        tripId: trip._id,
        userEmail: trip.createdBy.email
      });

      if (!existingMember) {
        console.log("Adding creator " + trip.createdBy.email + " as member for trip " + trip.title);
        await Member.create({
          userEmail: trip.createdBy.email,
          tripId: trip._id,
          role: "admin",
        });
      } else {
        console.log("Creator " + trip.createdBy.email + " already member of trip " + trip.title);
      }
    }

    console.log("Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();