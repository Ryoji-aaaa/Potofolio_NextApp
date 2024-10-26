import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import React from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadingElements = document.querySelectorAll(
        ".index-loading, .index-loadings"
      );
      loadingElements.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {router.pathname === "/mypage" && ( // /mypageの場合<header>を表示
        <header>
          <nav>
            <Link href="/login">Login</Link> |{" "}
            <Link href="/register">Register</Link> |{" "}
            <Link href="/mypage">My Page</Link>
          </nav>
        </header>
      )}
      <main>{children}</main>
      <style jsx global>{`
        .index-loadings {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Layout;
