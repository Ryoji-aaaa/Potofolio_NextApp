import { NextResponse } from 'next/server';
import Reservation from '@/lib/ReservationModels';
import connectDB from '@/lib/mongodb';

// POSTメソッド: 予約データの削除
export async function POST(request: Request) {
  await connectDB();

  const { userId, reservationIds } = await request.json();

  // バリデーション
  if (!userId || !reservationIds || !Array.isArray(reservationIds)) {
    return NextResponse.json({ message: '不正なデータです。' }, { status: 400 });
  }

  try {
    // 指定のuserIdの予約データを取得
    const userReservation = await Reservation.findOne({ userId });

    if (!userReservation) {
      return NextResponse.json({ message: '予約データが見つかりません。' }, { status: 404 });
    }

    // 指定された予約IDを削除
    userReservation.reservations = userReservation.reservations.filter(
      (reservation: { _id: string }) => !reservationIds.includes(reservation._id.toString())
    );

    await userReservation.save();
    return NextResponse.json({ message: '予約が削除されました！' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '予約の削除に失敗しました。' }, { status: 500 });
  }
}