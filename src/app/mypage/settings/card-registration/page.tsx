"use client";
import { useSession } from "next-auth/react";

export default function MyPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Settings (Card Registration)</h1>
      <p>Name: {session!.user.username}</p>
      <a style={{ color: "red" }}>ここにクレジットカード情報登録画面を実装予定</a>
      <p>Card No.</p>
      <form>
        <input type="text" placeholder="1234 5678 9012 3456" />
        <button>登録</button>
      </form>
    </div>
  );
}
