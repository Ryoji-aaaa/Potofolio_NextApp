// app/mypage/page.tsx
"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function MyPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>My Page</h1>
      <p>Name: {session!.user.username}</p>
      <p>Email: {session!.user.email}</p>
      <button onClick={() => signOut()}><LogOut/> Sign Out</button>
    </div>
  );
}
