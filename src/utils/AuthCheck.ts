import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const authCheck = () => {
  const [loginUser, setLoginUser] = useState<{ username: string; email: string }>({ username: "", email: "" });
  const router = useRouter();

  // トークン情報を取り出して検証する
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // トークンを検証する
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY as string) as { username: string; email: string };

      setLoginUser(decoded);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  return loginUser;
};

export default authCheck;
