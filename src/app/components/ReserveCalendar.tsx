// src/app/components/ReserveCalendar.tsx
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import{ DateSelectArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Reservation {
  id: string;
  date: string;
  bentoType: string;
}

const ReserveCalendar: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bentoType, setBentoType] = useState<string>("A"); // デフォルトの弁当タイプを設定
  const { data: session } = useSession();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservation", { method: "GET" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        console.error("予約データが配列ではありません:", data);
        setReservations([]); // デフォルトで空の配列を設定
      }
    } catch (error) {
      console.error("予約データの取得中にエラーが発生しました:", error);
      setReservations([]); // エラー時に空の配列を設定
    }
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
    if (!session) {
      alert("認証が必要です");
      return;
    }

    if (selectedDates.length === 0) {
      alert("予約する日付を選択してください。");
      return;
    }

    for (const date of selectedDates) {
      await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken || session.user.id}`,
        },
        body: JSON.stringify({
          date,
          bentoType,
          userId: session.user.id, // 認証情報から取得
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
        events={Array.isArray(reservations) ? reservations.map((res) => ({
          title: "予約済み",
          start: res.date,
          end: res.date,
          display: "background",
        })) : []}
        eventContent={renderEventContent}
        selectMirror={true}
      />
      <div style={{ marginTop: "1rem" }}>
        <label>弁当タイプを選択:</label>
        <select value={bentoType} onChange={(e) => setBentoType(e.target.value)}>
          <option value="A">弁当A</option>
          <option value="B">弁当B</option>
          <option value="C">弁当C</option>
        </select>
      </div>
      <button onClick={handleReservationSubmit} style={{ marginTop: "1rem" }}>
        予約を確定する
      </button>
    </div>
  );
};

export default ReserveCalendar;