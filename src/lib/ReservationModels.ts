import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  dates: { type: Date, required: true }, // 選択された複数の日付
  type: { type: String, required: true, enum: ["A", "B", "C"] },
});

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
