"use client";
import { useSession } from "next-auth/react";
import ReserveCalendar from "@/app/components/ReserveCalendar";

export default function ReservationPage() {
  const { data: session } = useSession();
    return (
    <div>
      <h1>Reservation</h1>
      <p>Name: {session!.user.username}</p>
      <ReserveCalendar />
    </div>
  );
}

