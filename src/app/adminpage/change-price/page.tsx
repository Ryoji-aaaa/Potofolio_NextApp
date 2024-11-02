// src/app/adminpage/change-price/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BentoPrice {
  bentoType: "A" | "B" | "C";
  currentPrice: number;
  priceHistory: { date: string; price: number }[];
}

export default function ChangePricePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bentoPrices, setBentoPrices] = useState<BentoPrice[]>([]);
  const [newPrices, setNewPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (status === "loading") {
      return; // Wait until the session is fully loaded
    }
    if (status === "authenticated" && session?.user.admin) {
      fetchBentoPrices();
    } else {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

  const fetchBentoPrices = async () => {
    try {
      const response = await fetch("/api/bento-prices");
      const data = await response.json();
      setBentoPrices(data);
    } catch (error) {
      console.error("Failed to fetch bento prices", error);
    }
  };

//   const fetchPriceHistory = async (bentoType: string) => {
//     try {
//       const response = await fetch(`/api/bento-prices?bentoType=${bentoType}`);
//       const data = await response.json();
//       setBentoPrices((prev) =>
//         prev.map((bento) =>
//           bento.bentoType === bentoType ? { ...bento, priceHistory: data } : bento
//         )
//       );
//     } catch (error) {
//       console.error("Failed to fetch price history", error);
//     }
//   };

  const handlePriceChange = (bentoType: string, price: number) => {
    setNewPrices((prev) => ({ ...prev, [bentoType]: price }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/bento-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrices),
      });

      if (!response.ok) {
        throw new Error("Failed to update prices");
      }

      alert("Prices updated successfully");
      fetchBentoPrices();
    } catch (error) {
      console.error("Failed to update prices", error);
      alert("Failed to update prices");
    }
  };

  return (
    <div>
      <h1>弁当価格変更</h1>
      <ul>
        {bentoPrices.map((bento) => (
          <li key={bento.bentoType}>
            <h2>弁当タイプ: {bento.bentoType}</h2>
            <p>現在の価格: ¥{bento.currentPrice}</p>
            <input
              type="integer"
            pattern="[0-9]*"
              value={newPrices[bento.bentoType] || bento.currentPrice}
              onChange={(e) => handlePriceChange(bento.bentoType, parseInt(e.target.value))}
            />
            {/* <button onClick={() => fetchPriceHistory(bento.bentoType)}>価格変更履歴を表示</button>
            <h3>価格変更履歴</h3>
            <ul>
              {bento.priceHistory.map((history, index) => (
                <li key={index}>
                  {new Date(history.date).toLocaleDateString()}: ¥{history.price}
                </li>
              ))}
            </ul> */}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>価格を更新する</button>
    </div>
  );
}