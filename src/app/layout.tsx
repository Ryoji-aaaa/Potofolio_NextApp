"use client";
import "@/styles/globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(children);
  return (
    <html lang="ja">
      <head>
        <title>My App</title>
        <meta name="description" content="This is a sample Next.js app" />
      </head>
      <body className={inter.className}>
        <nav>
          <Link href="/login">Login</Link> |{" "}
          <Link href="/register">Register</Link> |{" "}
          <Link href="/mypage">My Page</Link>
        </nav>
        <main>
          <NextAuthProvider>{children}</NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
