// src/app/payment-details/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface Reservation {
  date: string;
  bentoType: string;
  price: number;
}

function PaymentDetailsPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedMonth(e.target.value);
  };

  const fetchReservations = useCallback(async () => {
    if (!selectedMonth) return;

    try {
      const response = await fetch(`/api/payment-details?month=${selectedMonth}`);
      const data = await response.json();
      setReservations(data.reservations);
      setTotalPrice(data.totalPrice);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchReservations();
  }, [selectedMonth, fetchReservations]);

  return (
    <div>
      <h1>お支払い明細</h1>
      <p>
        支払方法の登録・変更は
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/mypage/settings/card-registration");
          }}
        >こちら</span></p>
      <label htmlFor="month">月を選択:</label>
      <input
        type="month"
        id="month"
        value={selectedMonth}
        onChange={handleMonthChange}
      />
      <h2>合計金額: ¥{totalPrice.toLocaleString()}</h2>
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index}>
            {reservation.date}: {reservation.bentoType} - ¥{reservation.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentDetailsPage;