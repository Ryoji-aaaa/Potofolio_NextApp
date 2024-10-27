// app/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
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
    return <p>Loading...</p>;
  }

  return <p>Redirecting...</p>;
}