"use client";
import { useRouter } from "next/navigation";
import InfoBox from "@/app/components/InfoBox";
import { ChangeEvent, useState } from "react";
// import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [info, setInfo] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [hint, setHint] = useState("");

  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.username || !info.email || !info.password) {
      setError("Must provide all Credentials");
      return;
    }
    try {
      setPending(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      if (res.ok) {
        router.push("/auth/signin");
        setHint("user signup success");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        setPending(false);
      }
    } catch (err) {
      setPending(false);
      setError(("setPending[/singUp]:38 :" + err) as string);
    }
  };

  // if (res.ok) {
  //   router.push("/auth/signin");
  // } else {
  //   alert("Sign up failed");
  // }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>アカウント登録</h1>
        <input
          type="text"
          name="username"
          onChange={(e) => handleInput(e)}
          placeholder="Username"
          required
        />
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
          {pending ? "processing" : "Sign Up"}
        </button>
        {error && (
          <InfoBox mode="error" severity="high">
            {error}
          </InfoBox>
        )}
        {hint && <InfoBox mode="hint">{hint}</InfoBox>}
      </form>
      <p>
        <span
          className="underlineURL"
          onClick={() => {
            router.push("/auth/signin");
          }}
        >
          ログイン画面
        </span>
        へ
      </p>
    </div>
  );
}
