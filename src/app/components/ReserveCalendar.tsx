"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import InfoBox from './InfoBox';

interface Reservation {
  date: string;
  bentoType: string;
}

export default function ReserveCalendar() {
  const { data: session } = useSession();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [bentoType, setBentoType] = useState<string>('A');
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  const [infoBox, setInfoBox] = useState<string>('');

  useEffect(() => {
    // 過去の予約を取得
    const fetchReservations = async () => {
      if (session) {
        try {
          const response = await axios.get('/api/reservation', {
            params: { userId: session.user.id }
          });
          setExistingReservations(response.data.reservations);
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
    const isPastDate = dayjs(selectedDate).isBefore(dayjs().startOf('day'));

    if (isWeekend || isPastDate) {
      setInfoBox("土日、または過去の日付は予約できません。");
      return;
    }

    setSelectedDates((prevDates) => {
      if (prevDates.includes(selectedDate)) {
        return prevDates.filter(date => date !== selectedDate); // 選択解除
      } else {
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
      setSelectedDates([]);
      // 再度予約一覧を取得して更新
      const response = await axios.get('/api/reservation', {
        params: { userId: session.user.id }
      });
      setExistingReservations(response.data.reservations);
    } catch (error) {
      console.error(error);
      alert('予約に失敗しました。');
    }
  };

  // カレンダーに表示するイベントデータ
  const events = [
    ...selectedDates.map(date => ({
      title: bentoType,
      start: date,
      backgroundColor: '#ff9f89',
      borderColor: '#ff6f61',
    })),
    ...existingReservations.map(reservation => ({
      title: reservation.bentoType,
      start: reservation.date,
      backgroundColor: '#87cefa', // 既存予約の背景色
      borderColor: '#4682b4',     // 既存予約のボーダー色
    }))
  ];

  return (
    <div>
      <h1>予約カレンダー</h1>
      {infoBox ? <InfoBox mode ="warning" severity="medium">{infoBox}</InfoBox> : null}
      <FullCalendar
        locale = "ja"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}  // 既存の予約と選択済み日付を反映
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
