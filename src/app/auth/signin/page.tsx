// app/auth/signin/page.tsx
"use client";
import InfoBox from "@/app/_components/InfoBox";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div>
      <InfoBox mode="hint">
        <p>Guest ユーザーでログインする場合は、</p>
        <p>メールアドレス:abc@example.com</p>
        <p>パスワード:password123</p>
      </InfoBox>
      <form onSubmit={handleSubmit}>
        <label>
          Email:{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign In</button>
        <p>
          アカウントをお持ちでない方は
          <button
            className="underlineURL"
            onClick={() => {
              router.push("/signup");
            }}
          >
            こちら
          </button>
        </p>
      </form>
    </div>
  );
}
