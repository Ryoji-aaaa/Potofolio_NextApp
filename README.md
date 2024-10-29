This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

##Memo
"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
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
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          reservations,
        }),
      });

      if (!response.ok) {
        throw new Error('予約に失敗しました。');
      }

      alert('予約が完了しました！');
      setSelectedDates([]);
      // 再度予約一覧を取得して更新
      const fetchResponse = await fetch(`/api/reservation?userId=${session.user.id}`);
      const data = await fetchResponse.json();
      setExistingReservations(data.reservations);
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
      {infoBox ? <InfoBox mode="warning" severity="medium">{infoBox}</InfoBox> : null}
      <FullCalendar
        locale="ja"
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


