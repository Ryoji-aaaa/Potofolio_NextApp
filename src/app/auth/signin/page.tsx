"use client";

import InfoBox from "@/app/components/InfoBox";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function SignInPage() {
  const [info, setInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!info.email || !info.password) {
      setError("Must provide all Credentials");
      return;
    }
    try {
      setPending(true);
      const res = await signIn("credentials", {
        email: info.email,
        password: info.password,
        redirect: false,
      });
      if (res?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session.user.admin) {
          router.replace("/adminpage");
        } else {
          router.replace("/mypage");
        }
      } else {
        setError("Sign in failed");
      }
    } catch (err) {
      setError(("setPending[/singIn]:28 :" + err) as string);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>ログイン画面</h1>
        <InfoBox mode="hint">
          <p>Guest LoginのEmailとPassword</p>
          <p>abc@example.com</p>
          <p>password123</p>
        </InfoBox>
        <input
          type="email"
          name="email"
          onChange={(e) => handleInput(e)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          onChange={(e) => handleInput(e)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={pending ? true : false}>
          {pending ? "processing" : "Sign In"}
        </button>
        {error && (
          <InfoBox mode="error" severity="high">
            {error}
          </InfoBox>
        )}
      </form>
      <p>
        アカウントをお持ちでない方は
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/auth/signup");
          }}
        >
          こちら
        </span>
      </p>
    </div>
  );
}
