"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReserveCalendar from "@/app/_components/ReserveCalendar";

export default function ReservationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  //useDate??
  const [date, setDate] = useState("");
  const [bentoType, setBentoType] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, bentoType }),
    });

    if (response.ok) {
      alert("予約が完了しました！");
    } else {
      alert("予約に失敗しました。");
    }
  };

  return (
    <div>
      <h1>Reservation</h1>
      <p>Name: {session.user.username}</p>
      <p>ここにカレンダー機能などを追加</p>
      <h1>予約カレンダー</h1>
      <ReserveCalendar />
      <form onSubmit={handleSubmit}>
      <label>
        予約日:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        弁当の種類:
        <input
          type="text"
          value={bentoType}
          onChange={(e) => setBentoType(e.target.value)}
          required
        />
      </label>
      <button type="submit">予約する</button>
    </form>
    </div>
  );
}

