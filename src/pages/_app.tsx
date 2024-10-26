import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Layout from "@/components/Layout";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="index-loading">Loading</div>
      <p className="index-loadings">
        Loadingの表示のままの場合
        <br />
        Google Chrome{" "}
        <a target="_blank" href="https://www.google.com/intl/ja_jp/chrome/">
          最新版
        </a>
        をご利用ください。
      </p>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}

export default MyApp;
