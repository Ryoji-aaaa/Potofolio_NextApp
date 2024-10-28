"use client";
import { useSession } from "next-auth/react";
import ReserveCalendar from "@/app/_components/ReserveCalendar";

export default function ReservationPage() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Reservation</h1>
      <p>Name: {session!.user.username}</p>
      <p>ここにカレンダー機能などを追加</p>
      <h1>予約カレンダー</h1>
      <ReserveCalendar />
    </div>
  );
}

