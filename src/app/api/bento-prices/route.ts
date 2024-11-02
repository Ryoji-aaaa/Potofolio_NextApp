// src/app/api/bento-prices/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BentoPriceModel from "@/lib/BentoPriceModels";

export async function GET(request: Request) {
  await connectDB();
  const url = new URL(request.url);
  const bentoType = url.searchParams.get("bentoType");

  if (bentoType) {
    const bentoPrice = await BentoPriceModel.findOne({ bentoType });
    if (bentoPrice) {
      return NextResponse.json(bentoPrice.priceHistory);
    } else {
      return NextResponse.json({ message: "Bento type not found" }, { status: 404 });
    }
  } else {
    const bentoPrices = await BentoPriceModel.find({});
    return NextResponse.json(bentoPrices);
  }
}

export async function POST(request: Request) {
  await connectDB();
  const newPrices = await request.json();

  for (const [bentoType, price] of Object.entries(newPrices)) {
    const bentoPrice = await BentoPriceModel.findOne({ bentoType });
    if (bentoPrice) {
      bentoPrice.currentPrice = price;
      bentoPrice.priceHistory.push({ price });
      await bentoPrice.save();
    }
  }

  return NextResponse.json({ message: "Prices updated successfully" });
}