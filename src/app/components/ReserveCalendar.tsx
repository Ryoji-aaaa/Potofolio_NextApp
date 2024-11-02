"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import InfoBox from "./InfoBox";

interface Reservation {
  date: string;
  bentoType: string;
}

export default function ReserveCalendar() {
  const { data: session } = useSession();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [bentoType, setBentoType] = useState<string>("A");
  const [existingReservations, setExistingReservations] = useState<
    Reservation[]
  >([]);
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
            `/api/reservation?userId=${session.user!.id}`
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

  // 日付選択と解除の処理
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = selectInfo.startStr;
    const isWeekend = [0, 6].includes(dayjs(selectedDate).day());
    const isPastDate = dayjs(selectedDate).isBefore(dayjs().startOf("day"));

    if (isWeekend) {
      setInfoBox({ severty: "high", message: "休日は予約できません。" });
    }
    if (isPastDate) {
      setInfoBox({
        severty: "high",
        message: "今日より前の日は予約できません。",
      });
    }
    if (isWeekend || isPastDate) {
      setTimeout(() => {
        setInfoBox({ severty: "low", message: "" });
      }, 2000);
    }

    setSelectedDates((prevDates) => {
      if (isWeekend || isPastDate) {
        return prevDates;
      } else if (prevDates.includes(selectedDate)) {
        return prevDates.filter((date) => date !== selectedDate); // 選択解除
      } else {
        return [...prevDates, selectedDate];
      }
    });
  };

  // 予約の登録
  const handleReservation = async () => {
    if (!selectedDates.length) {
      alert("日付を選択してください。");
      return;
    }
    if (!session) return;

    const reservations = selectedDates.map((date) => ({
      date,
      bentoType,
    }));

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user!.id,
          reservations,
        }),
      });

      if (!response.ok) {
        throw new Error("予約に失敗しました。");
      }

      alert("予約が完了しました！");
      setSelectedDates([]);
      const fetchResponse = await fetch(
        `/api/reservation?userId=${session.user!.id}`
      );
      const data = await fetchResponse.json();
      setExistingReservations(data.reservations);
    } catch (error) {
      console.error(error);
      alert("予約に失敗しました。");
    }
  };

  // カレンダーに表示するイベントデータ
  const events = [
    // 選択済み日付を反映
    ...selectedDates.map((date) => ({
      title: bentoType,
      start: date,
      backgroundColor: "#ff9f89",
      borderColor: "#ff6f61",
    })),
    // 既存の予約データを反映
    ...existingReservations.map((reservation) => ({
      title: reservation.bentoType,
      start: reservation.date,
      display: "flex",
      backgroundColor: "#87cefa", 
      borderColor: "#4682b4", 
      
    })),
  ];
  const renderEventContent = (eventContent: EventContentArg) => (
    <span>{eventContent.event.title}</span>
  );

  return (
    <div>
      <h1>予約カレンダー</h1>
      <p>スマホで操作する場合は長押しで選択してください</p>
      <FullCalendar
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        longPressDelay={100} // 長押しの遅延時間（ミリ秒）
        select={handleDateSelect}
        events={events} // 既存の予約と選択済み日付を反映
        eventContent={renderEventContent}
      />
      <div>
        <label>弁当の種類を選択：</label>
        <select
          value={bentoType}
          onChange={(e) => setBentoType(e.target.value)}
        >
          <option value="A"> A 弁当</option>
          <option value="B"> B 弁当</option>
          <option value="C"> C 弁当</option>
        </select>
      </div>
      {infoBox.message ? (
        <InfoBox mode="warning" severity={infoBox.severty}>
          {infoBox.message}
        </InfoBox>
      ) : null}
      <button onClick={() => setSelectedDates([])}>選択をクリア</button>
      <button onClick={handleReservation}>予約を確定する</button>
    </div>
  );
}
