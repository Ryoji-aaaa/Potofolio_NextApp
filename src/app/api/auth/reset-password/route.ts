import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/SchemaModels";

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();
    await connectDB();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (err) {
    console.error("Error resetting password:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}