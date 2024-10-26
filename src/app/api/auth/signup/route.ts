// app/api/auth/signup/route.ts
import { hash } from "bcryptjs";
import clientPromise from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  const client = await clientPromise;
  const db = client.db("mydatabase");
  const users = db.collection("users");

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hash(password, 12);
  await users.insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "User created successfully" }, { status: 201 });
}
