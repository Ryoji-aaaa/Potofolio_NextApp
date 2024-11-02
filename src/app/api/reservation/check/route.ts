import { NextResponse } from 'next/server';
import Reservation from '@/lib/ReservationModels';
import connectDB from '@/lib/mongodb';
import { NextRequest } from 'next/server';

interface ReservationData {
    username: string;
    email: string;
    bentoType: string;
}

export async function GET(request: NextRequest) {
  await connectDB();

  const date = request.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ message: '日付が指定されていません。' }, { status: 400 });
  }

  try {
    // 指定の日付の予約データを取得
    const reservations = await Reservation.find({ "reservations.date": new Date(date) })
      .populate('userId', 'username email')
      .exec();

    if (!reservations.length) {
      return NextResponse.json({ reservations: [] }, { status: 200 });
    }

    // データを整形して返す
    const result = reservations.flatMap(reservation => 
      reservation.reservations
        .filter((r: { date: Date }) => r.date.toISOString().startsWith(date))
        .map((r:{bentoType:string}) => {
          if (reservation.userId) {
            return {
              username: reservation.userId.username,
              email: reservation.userId.email,
              bentoType: r.bentoType,
            };
          }
          return null;
        })
        .filter((r: ReservationData | null) => r !== null)
    );

    return NextResponse.json({ reservations: result }, { status: 200 });
  } catch (error) {
    console.error("予約データの取得に失敗しました", error);
    return NextResponse.json({ message: 'サーバーエラーです。' }, { status: 500 });
  }
}