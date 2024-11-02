// src/lib/BentoPriceModels.ts
import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now }, // 変更日
  price: { type: Number, required: true }, // 変更された価格
});

const BentoPriceSchema = new mongoose.Schema({
  bentoType: { type: String, required: true, enum: ["A", "B", "C"], unique: true }, // 弁当の種類
  currentPrice: { type: Number, required: true }, // 現在の価格
  priceHistory: [PriceHistorySchema], // 価格変更履歴
});

export default mongoose.models.BentoPrice || mongoose.model("BentoPrice", BentoPriceSchema);