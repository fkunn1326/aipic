import { Html, Head, Main, NextScript } from "next/document"
import Script from 'next/script';
import React from "react";

const Document = () => {
  return (
    <Html lang="ja">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#38bdf8" />
      </Head> 
      <body className="dark:bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
