// components/ReserveCalendar.tsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";

interface Reservation {
  id: string;
  date: string;
  bentoType: string;
}

const ReserveCalendar: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const res = await fetch("/api/reservations", { method: "GET" });
    const data = await res.json();
    setReservations(data);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = selectInfo.startStr;
    if (!selectedDates.includes(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);
    } else {
      setSelectedDates(selectedDates.filter((date) => date !== selectedDate));
    }
  };

  const handleReservationSubmit = async () => {
    for (const date of selectedDates) {
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          bentoType: "弁当A", // 必要に応じて変更
          userId: "ユーザーID", // 認証情報から取得
        }),
      });
    }
    alert("予約が完了しました！");
    setSelectedDates([]);
    fetchReservations();
  };

  const renderEventContent = (eventContent: EventContentArg) => (
    <span style={{ color: "red", fontWeight: "bold" }}>予約済み</span>
  );

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={reservations.map((res) => ({
          title: "予約済み",
          start: res.date,
          end: res.date,
          display: "background",
        }))}
        eventContent={renderEventContent}
        selectMirror={true}
      />
      <button onClick={handleReservationSubmit}>予約を確定する</button>
    </div>
  );
};

export default ReserveCalendar;
