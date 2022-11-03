import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

const Document = () => {
  return (
    <Html lang="ja">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </Head> 
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
