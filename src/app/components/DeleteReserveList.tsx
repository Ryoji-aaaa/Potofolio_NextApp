"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface Reservation {
  _id: string;
  date: string;
  bentoType: string;
}

export default function DeleteReserveList() {
  const { data: session } = useSession();
  const [existingReservations, setExistingReservations] = useState<
    Reservation[]
  >([]);
  const [selectedReservations, setSelectedReservations] = useState<string[]>(
    []
  );
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    // 過去の予約を取得
    const fetchReservations = async () => {
      if (session) {
        try {
          const response = await fetch(
            `/api/reservation?userId=${session.user.id}`
          );
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
      const fetchResponse = await fetch(
        `/api/reservation?userId=${session.user.id}`
      );
      const data = await fetchResponse.json();
      setExistingReservations(data.reservations);
    } catch (error) {
      console.error(error);
      alert("予約の削除に失敗しました。");
    }
  };

  const handleButtonClick = (reservationId: string) => {
    setSelectedReservations((prevSelected) => {
      if (prevSelected.includes(reservationId)) {
        return prevSelected.filter((id) => id !== reservationId);
      } else {
        return [...prevSelected, reservationId];
      }
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const [year, month] = e.target.value.split("-");
    setYear(Number(year));
    setMonth(Number(month));
    setSelectedMonth(e.target.value);
  };

  const filteredReservations = existingReservations
    .filter((reservation) => {
      const reservationDate = dayjs(reservation.date);
      return (
        reservationDate.year() === year && reservationDate.month() + 1 === month
      );
    })
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const isDeletable = (date: string) => {
    const reservationDate = dayjs(date);
    const today = dayjs();
    return reservationDate.isAfter(today.add(1, "day"));
  };

  return (
    <div>
      <h1>予約の削除</h1>
      <div>
        {filteredReservations.length === 0 && <p>予約がありません</p>}
        <label>
          月を選択:
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </label>
      </div>
      <ul>
        {filteredReservations.map((reservation) => (
          <li key={reservation._id} style={{ listStyleType: "none" }}>
            <button
              className="form-button"
              onClick={() => handleButtonClick(reservation._id)}
              style={{
                backgroundColor: selectedReservations.includes(reservation._id)
                  ? "lightblue"
                  : "white",
              }}
              disabled={!isDeletable(reservation.date)}
            >
              <span>
                {dayjs(reservation.date).format("MM月DD日")} -{" "}
                {reservation.bentoType}
              </span>
              {dayjs(reservation.date).format("YYYY-MM-DD") ===
                dayjs().format("YYYY-MM-DD") && (
                <a href="/mypage/barcode">受け取り画面へ</a>
              )}
              {!isDeletable(reservation.date) && (
                <span style={{ fontSize: "10px", color: "red" }}>
                  予約取消は前日まで
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleDeleteReservations}>選択した予約を削除する</button>
    </div>
  );
}
