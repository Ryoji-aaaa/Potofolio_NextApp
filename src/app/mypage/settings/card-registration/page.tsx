"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>Sign out</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Settings (Card Registration)</h1>
      <p>Name: {session.user.username}</p>
      <a style={{ color: 'red' }}>ここにクレジットカード情報登録画面を実装予定</a>
      <p>Card No.</p>
      <form>
        <input type="text" placeholder="1234 5678 9012 3456" />
        <button>登録</button>
      </form>
    </div>
  );
}
