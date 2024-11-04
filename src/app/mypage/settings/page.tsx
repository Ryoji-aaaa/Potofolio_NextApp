// app/mypage/page.tsx
"use client";
import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
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

  return (
    <div>
      <h1>Settings </h1>
      <a>(UserName: {session!.user.username})</a>
      <p>
        パスワードの変更
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/settings/password-reset");
          }}
        >
          こちら
        </span>
      </p>
      <p>
        クレジットカード情報の追加
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/settings/card-registration");
          }}
        >
          こちら
        </span>
      </p>

      <button onClick={() => signOut()}><LogOut />Sign Out</button>
    </div>
  );
}
