"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg } from "@fullcalendar/core";
// import {DateSelectArg} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
// import dayjs from "dayjs";
import InfoBox from "./InfoBox";

interface Reservation {
  _id: string;
  date: string;
  bentoType: string;
}

export default function DeleteReserveCalendar() {
  const { data: session } = useSession();
  const [existingReservations, setExistingReservations] = useState<
    Reservation[]
  >([]);
  const [selectedReservations, setSelectedReservations] = useState<string[]>(
    []
  );
  const [infoBox, setInfoBox] = useState<{
    severty: "high" | "medium" | "low";
    message: string;
  }>({
    severty: "low",
    message: "",
  });

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
      setInfoBox({
        severty: "low",
        message: "削除する予約を選択してください。",
      });
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

  // カレンダーに表示するイベントデータ
  const events = existingReservations.map((reservation) => ({
    id: reservation._id,
    title: reservation.bentoType,
    start: reservation.date,
    backgroundColor: selectedReservations.includes(reservation._id)
      ? "#ff9f89"
      : "#87cefa",
    borderColor: selectedReservations.includes(reservation._id)
      ? "#ff6f61"
      : "#4682b4",
  }));

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    const reservationId = clickInfo.event.id;
    setSelectedReservations((prevSelected) => {
      if (prevSelected.includes(reservationId)) {
        return prevSelected.filter((id) => id !== reservationId);
      } else {
        return [...prevSelected, reservationId];
      }
    });
  };

  const renderEventContent = (eventContent: EventContentArg) => (
    <span>{eventContent.event.title}</span>
  );

  return (
    <div>
      <h1>予約削除カレンダー</h1>
      <FullCalendar
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />
      {infoBox.message ? (
        <InfoBox mode="warning" severity={infoBox.severty}>
          {infoBox.message}
        </InfoBox>
      ) : null}
      <button onClick={handleDeleteReservations}>選択した予約を削除する</button>
    </div>
  );
}
