"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div>
      <h1>My Page</h1>
      <p>Name: {session!.user.username}</p>
      <p>Email: {session!.user.email}</p>
      <p>-----使い方-----</p>
      <p>
        1. 予約を追加する
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/reservation");
          }}
        >こちら</span>
      </p>
      <p>
        2. 予約を確認・削除する
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/reservation/delete-reservation");
          }}
        >こちら</span>
      </p>
      <p>
        3. 受け取り時にバーコードを表示する
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/barcode");
          }}
        >こちら</span></p>
      <button onClick={() => signOut()}>
        <LogOut /> Sign Out
      </button>
    </div>
  );
}
