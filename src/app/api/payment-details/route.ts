import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ReservationModel from "@/lib/ReservationModels";
import BentoPriceModel from "@/lib/BentoPriceModels";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  if (!month) {
    return NextResponse.json({ message: "Month is required" }, { status: 400 });
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  try {
    const reservations = await ReservationModel.find({
      "reservations.date": { $gte: startDate, $lte: endDate },
    }).populate("userId");

    const bentoPrices = await BentoPriceModel.find({});
    const priceMap = bentoPrices.reduce((map, bento) => {
      map[bento.bentoType] = bento.currentPrice;
      return map;
    }, {});

    const reservationDetails: { date: string; bentoType: string; price: number }[] = [];
    let totalPrice = 0;

    reservations.forEach((reservation) => {
    reservation.reservations.forEach((bento: { date: Date; bentoType: string }) => {
      if (bento.date >= startDate && bento.date <= endDate) {
        const price: number = priceMap[bento.bentoType];
        reservationDetails.push({
        date: bento.date.toISOString().split("T")[0],
        bentoType: bento.bentoType,
        price,
        });
        totalPrice += price;
      }
    });
    });

    return NextResponse.json({ reservations: reservationDetails, totalPrice });
  } catch (error) {
    console.error("Failed to fetch reservations", error);
    return NextResponse.json({ message: "Failed to fetch reservations" }, { status: 500 });
  }
}