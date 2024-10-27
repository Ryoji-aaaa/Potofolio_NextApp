import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  bentoType: { type: String, required: true },
});

export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
