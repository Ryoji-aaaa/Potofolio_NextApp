import { NextResponse } from 'next/server';
import Reservation from '@/lib/ReservationModels';
import connectDB from '@/lib/mongodb';

// GETメソッド: 特定のユーザーの予約データを取得
export async function GET(request) {
  await connectDB();

  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: 'ユーザーIDが指定されていません。' }, { status: 400 });
  }

  try {
    // 指定のuserIdの予約データを取得
    const userReservation = await Reservation.findOne({ userId }).exec();

    if (!userReservation) {
      return NextResponse.json({ reservations: [] }, { status: 200 });
    }

    // データを返す
    return NextResponse.json({ reservations: userReservation.reservations }, { status: 200 });
  } catch (error) {
    console.error("予約データの取得に失敗しました", error);
    return NextResponse.json({ message: 'サーバーエラーです。' }, { status: 500 });
  }
}

// POSTメソッド: 予約データの登録
export async function POST(request) {
  await connectDB();

  const { userId, reservations } = await request.json();

  // バリデーション
  if (!userId || !reservations || !Array.isArray(reservations)) {
    return NextResponse.json({ message: '不正なデータです。' }, { status: 400 });
  }

  try {
    // 既存の予約を検索または新しい予約ドキュメントを作成
    let userReservation = await Reservation.findOne({ userId });

    if (userReservation) {
      // 既存の予約データに追加
      userReservation.reservations.push(...reservations);
    } else {
      // 新しい予約データの作成
      userReservation = new Reservation({ userId, reservations });
    }

    await userReservation.save();
    return NextResponse.json({ message: '予約が完了しました！' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '予約処理に失敗しました。' }, { status: 500 });
  }
}
