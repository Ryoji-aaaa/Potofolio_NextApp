"use client";

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg } from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function ReserveCalendar() {
  const { data: session } = useSession();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [bentoType, setBentoType] = useState('A');

  // 日付選択・解除の処理
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = selectInfo.startStr;
    setSelectedDates((prevDates) => {
      if (prevDates.includes(selectedDate)) {
        // 選択済みの日付を再度クリックした場合、解除
        return prevDates.filter(date => date !== selectedDate);
      } else {
        // 新たに選択された日付を追加
        return [...prevDates, selectedDate];
      }
    });
  };

  // 予約の登録
  const handleReservation = async () => {
    if (!selectedDates.length) {
      alert('日付を選択してください。');
      return;
    }
    if (!session) return;

    const reservations = selectedDates.map(date => ({
      date,
      bentoType,
    }));

    try {
      await axios.post('/api/reservation', {
        userId: session.user.id,
        reservations,
      });
      alert('予約が完了しました！');
      setSelectedDates([]);  // 選択リセット
    } catch (error) {
      console.error(error);
      alert('予約に失敗しました。');
    }
  };

  // 選択された日付をカレンダーに表示するためのイベントデータ
  const events = selectedDates.map(date => ({
    title: bentoType,
    start: date,
    backgroundColor: '#ff9f89',  // 選択時の背景色
    borderColor: '#ff6f61',      // 選択時のボーダー色
  }));

  return (
    <div>
      <h1>弁当予約カレンダー</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}  // 選択済み日付を反映するイベント
      />
      <div>
        <label>弁当の種類を選択：</label>
        <select value={bentoType} onChange={(e) => setBentoType(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>
      <button onClick={handleReservation}>予約を確定する</button>
    </div>
  );
}
