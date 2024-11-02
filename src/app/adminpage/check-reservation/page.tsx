"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg } from '@fullcalendar/core';
interface ReservationData {
    username: string;
    email: string;
    bentoType: string;
}

function CheckReservation() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [summary, setSummary] = useState<{ [key: string]: number }>({});

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    const date = selectInfo.startStr;
    setSelectedDate(date);

    try {
      const response = await fetch(`/api/reservation/check?date=${date}`);
      const data = await response.json();
      setReservations(data.reservations);

      // 集計
      const summary = data.reservations.reduce((acc: { [key: string]: number }, reservation: ReservationData) => {
        acc[reservation.bentoType] = (acc[reservation.bentoType] || 0) + 1;
        return acc;
      }, {});
      setSummary(summary);
    } catch (error) {
      console.error("予約データの取得に失敗しました", error);
    }
  };

  return (
    <div>
      <h1>予約確認</h1>
      <FullCalendar
        locale="ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
      />
      {selectedDate && (
        <div>
          <h2>{selectedDate}の予約情報</h2>
          <ul>
            {reservations!.map((reservation: ReservationData, index: number) => (
              <li key={index}>
                {reservation.username} ({reservation.email}) - {reservation.bentoType}
              </li>
            ))}
          </ul>
          <h3>集計</h3>
          <ul>
            {Object.entries(summary).map(([bentoType, count]) => (
              <li key={bentoType}>
                {bentoType}: {count}個
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CheckReservation;