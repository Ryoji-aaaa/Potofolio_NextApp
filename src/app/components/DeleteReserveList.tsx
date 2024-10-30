"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Reservation {
  _id: string;
  date: string;
  bentoType: string;
}

export default function DeleteReserveList() {
  const { data: session } = useSession();
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);

  useEffect(() => {
    // 過去の予約を取得
    const fetchReservations = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/reservation?userId=${session.user.id}`);
          const data = await response.json();
          setExistingReservations(data.reservations);
        } catch (error) {
          console.error("予約データの取得に失敗しました", error);
        }
      }
    };
    fetchReservations();
  }, [session]);

  // 予約の削除
  const handleDeleteReservations = async () => {
    if (!selectedReservations.length) {
      alert("削除する予約を選択してください。");
      return;
    }
    if (!session) return;

    try {
      const response = await fetch("/api/reservation/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          reservationIds: selectedReservations,
        }),
      });

      if (!response.ok) {
        throw new Error("予約の削除に失敗しました。");
      }

      alert("予約が削除されました！");
      setSelectedReservations([]);
      const fetchResponse = await fetch(`/api/reservation?userId=${session.user.id}`);
      const data = await fetchResponse.json();
      setExistingReservations(data.reservations);
    } catch (error) {
      console.error(error);
      alert("予約の削除に失敗しました。");
    }
  };

  const handleCheckboxChange = (reservationId: string) => {
    setSelectedReservations((prevSelected) => {
      if (prevSelected.includes(reservationId)) {
        return prevSelected.filter((id) => id !== reservationId);
      } else {
        return [...prevSelected, reservationId];
      }
    });
  };

  return (
    <div>
      <h1>予約削除リスト</h1>
      <ul>
        {existingReservations.map((reservation) => (
          <li key={reservation._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedReservations.includes(reservation._id)}
                onChange={() => handleCheckboxChange(reservation._id)}
              />
              {reservation.date} - {reservation.bentoType}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleDeleteReservations}>選択した予約を削除する</button>
    </div>
  );
}