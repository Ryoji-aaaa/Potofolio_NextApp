"use client";
import { useSession } from "next-auth/react";
// import DeleteReserveCalendar from "@/app/components/DeleteReserveCalendar";
import DeleteReserveList from "@/app/components/DeleteReserveList";

export default function DeleteReservationPage() {
  const { data: session } = useSession();
  return (
    <div>
      {/* <h1>予約削除ページ</h1> */}
      <p>Name: {session!.user.username}</p>
      {/* 動作未確認なので非表示中 */}
      {/* <DeleteReserveCalendar /> */}
      <DeleteReserveList />
    </div>
  );
}