// app/api/reservations/route.js
import dbConnect from "@/lib/mongodb";
import Reservation from "@/lib/ReservationModels";

export async function POST(req: Request) {
  const { userId, date, bentoType } = await req.json();
  await dbConnect();

  const newReservation = new Reservation({
    userId,
    date,
    bentoType,
  });

  await newReservation.save();

  return new Response(JSON.stringify({ message: "Reservation created successfully" }), { status: 201 });
}

export async function GET() {
  await dbConnect();
  const reservations = await Reservation.find({});
  return new Response(JSON.stringify(reservations), { status: 200 });
}
