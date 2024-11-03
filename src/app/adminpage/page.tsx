// app/adminpage/page.tsx
"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminPage() {
  const { data: session } = useSession();
  
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Name: {session!.user.username}</p>
      <p>Email: {session!.user.email}</p>
      <button onClick={() => signOut()}><LogOut/> Sign Out</button>
    </div>
  );
}
