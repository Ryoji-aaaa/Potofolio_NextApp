import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/UserModels";

export async function GET() {
  await connectDB();

  try {
    const users = await UserModel.find({}, 'username email').exec();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("ユーザー一覧の取得に失敗しました", error);
    return NextResponse.json({ message: 'サーバーエラーです。' }, { status: 500 });
  }
}