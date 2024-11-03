"use client";
import { useSession } from "next-auth/react";
// import DeleteReserveCalendar from "@/app/components/DeleteReserveCalendar";
import DeleteReserveList from "@/app/components/DeleteReserveList";

export default function DeleteReservationPage() {
  const { data: session } = useSession();
  return (
    <div>
      {/* 動作未確認なので非表示中 */}
      {/* <DeleteReserveCalendar /> */}
      <DeleteReserveList />
    </div>
  );
}