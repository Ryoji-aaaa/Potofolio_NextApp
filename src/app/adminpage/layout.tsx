// app/mypage/layout.tsx
"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

const AdminPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") {
      return; // Wait until the session is fully loaded
    }
    if (status === "authenticated" && session?.user.admin) {
      return;
    } else if (status === "authenticated" && !session?.user.admin) {
      router.push("/mypage");
    }
    else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

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
      <AdminSidebar/>
      {session.user.admin ? (
        <button onClick={() => router.push("/adminpage")}>管理者画面へ</button>
      ) : (
        ""
      )}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
};

export default AdminPageLayout;
