"use client";
import { useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReservationPage() {
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
        <p>Session Error</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Reservation</h1>
      <p>Name: {session.user.username}</p>
      <p>ここにカレンダー機能などを追加</p>
    </div>
  );
}
