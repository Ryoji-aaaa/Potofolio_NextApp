"use client";
import React, { useEffect, useState } from "react";
// import { Barcode as Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Barcode from "react-barcode";

const BarcodePage: React.FC = () => {
    const { data: session } = useSession();
    const [bentoType, setBentoType] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [today, setToday] = useState<string>("");

    useEffect(() => {
        const fetchReservation = async () => {
            if (session) {
                try {
                    const response = await fetch(`/api/reservation?userId=${session.user!.id}`);
                    const data = await response.json();
                    const todayDate = new Date().toISOString().split('T')[0];
                    setToday(todayDate);
                    const todayReservation = data.reservations.find((reservation: { date: string }) => reservation.date.startsWith(todayDate));
                    
                    if (todayReservation) {
                        setBentoType(todayReservation.bentoType);
                        setEmail(session.user!.email);
                    } else {
                        setMessage("本日予約の弁当はありません");
                    }
                } catch (error) {
                    console.error("予約データの取得に失敗しました", error);
                    setMessage("予約データの取得に失敗しました");
                }
            }
        };

        fetchReservation();
    }, [session]);

    return (
        <div>
            <h1>受け取り</h1>
            <p>日付: {today}</p>
            {bentoType && email ? (
                <div>
                    <Barcode value={`${email}-${bentoType}`} />
                    <p>Email: {email}</p>
                    <p>Bento Type: {bentoType}</p>
                </div>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
};

export default BarcodePage;