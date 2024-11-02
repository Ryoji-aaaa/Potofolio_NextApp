import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/UserModels";

export async function POST(request: Request) {
  await connectDB();
  const { username, email, password } = await request.json();
  const exists = await UserModel.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return NextResponse.json(
      { message: "Username or email already exists" },
      { status: 500 }
    );
  }
  const hashedPassword = await hash(password, 12);
  await UserModel.create({ username, email, password: hashedPassword ,admin : false});
  return NextResponse.json({ message: "User created" }, { status: 201 });
}
