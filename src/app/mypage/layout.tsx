// app/mypage/layout.tsx
"use client";
import React, { useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/mypage");
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="index-loading">Loading</div>;
  }
  if (!session) {
    return (
      <div>
        <h1>Session Error</h1>
        <p>
          <span
            className="underlineURL"
            onClick={() => {
              router.push("/auth/signin");
            }}
          >
            ログイン画面
          </span>
          へ
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
};

export default MyPageLayout;
