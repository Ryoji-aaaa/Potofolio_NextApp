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
  const [month, setMonth] = useState<number>(dayjs().month() + 1); // dayjsのmonthは0始まり

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

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentYear + 1;
  const afterNextMonth = nextMonth === 12 ? 1 : nextMonth + 1;

  return (
    <div>
      <h1>予約の削除</h1>
      <div>
        {filteredReservations.length === 0 && <p>予約がありません</p>}
        <label>
          年:
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={nextYear}>{nextYear}</option>
          </select>
        </label>
        <label>
          月:
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            <option value={currentMonth}>{currentMonth}</option>
            <option value={nextMonth}>{nextMonth}</option>
            <option value={afterNextMonth}>{afterNextMonth}</option>
          </select>
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
