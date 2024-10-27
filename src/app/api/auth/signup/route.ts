import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/SchemaModels";

export async function POST(request: Request) {
  await connectDB();
  const { username, email, password } = await request.json();
  // console.log({ username, email, password });
  const exists = await UserModel.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return NextResponse.json(
      { message: "Username or email already exists" },
      { status: 500 }
    );
  }
  const hashedPassword = await hash(password, 12);
  await UserModel.create({ username, email, password: hashedPassword });
  return NextResponse.json({ message: "User created" }, { status: 201 });
  // try {
  // } catch (err) {
  //   console.log("Error while signup connectiong.", err);
  //   return NextResponse.json(
  //     { message: "Error while signup" },
  //     { status: 500 }
  //   );
  // }
}
