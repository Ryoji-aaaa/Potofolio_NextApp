// src/app/api/reservation/route.ts
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { connectDB } from '@/lib/mongodb';
import ReservationModels from '@/lib/ReservationModels';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  await connectDB();

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const session = await getSession({ req: { headers: { authorization: `Bearer ${token}` } } });

  if (!session) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  const userId = session.user.id; // 認証されたユーザーID
  const { date, bentoType } = await request.json();

  try {
    const newReservation = await ReservationModels.create({
      userId: new ObjectId(userId), // userIdをObjectIdに変換
      date,
      bentoType,
    });
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error("予約の作成中にエラー:", error);
    return NextResponse.json({ message: "予約に失敗しました" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await connectDB();

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const session = await getSession({ req: { headers: { authorization: `Bearer ${token}` } } });

  if (!session) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
  }

  const userId = session.user.id; // 認証されたユーザーID

  try {
    const reservations = await ReservationModels.find({ userId: new ObjectId(userId) });
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("予約の取得中にエラー:", error);
    return NextResponse.json({ message: "予約の取得に失敗しました" }, { status: 500 });
  }
}