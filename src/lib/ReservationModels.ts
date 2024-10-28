// lib/ReservationModels.ts
import mongoose from "mongoose";

const BentoSchema = new mongoose.Schema({
  date: { type: Date, required: true },         // 予約日
  bentoType: { type: String, required: true ,enum : ["A","B","C"]}    // 弁当の種類（例："A", "B", "C"）
});

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  reservations: [BentoSchema]   // ユーザーごとの予約一覧（BentoSchemaの配列）
});

export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);

