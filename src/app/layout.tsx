// app/layout.tsx
import '../app/globals.css';
import SessionProviderWrapper from '../app/SessionProviderWrapper'; 
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Authentication App',
  description: 'A sample authentication app using Next.js, TypeScript, and MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <header>
            <nav>
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
              <Link href="/mypage">My Page</Link>
            </nav>
          </header>
          <main>{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
