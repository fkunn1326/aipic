import "../styles/globals.css";
import React from "react";
import UserInfoProvider from "../components/auth/userInfoProvider";
import Script from "next/script";
import { GATracking } from "../components/GaTracking";
import '../styles/crop.scss';
import useTransition from "../components/hooks/useTransition";

export const getServerSideProps  = async ({ req, res, locale }) => {
  const account = await fetch(`${process.env.BASE_URL}/api/auth/account`, {
    credentials: "include",
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      account: await account.json(),
    },
  }
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID as string;

function MyApp({ Component, pageProps, account }: any) {
  useTransition();
  return (
      <UserInfoProvider account={account}>
        <GATracking trackingId={GA_TRACKING_ID} />
        <Component {...pageProps} />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"
            onLoad={() => {
              // @ts-ignore
              const vConsole = new window.VConsole();
            }}
          />
        )}
      </UserInfoProvider>
  );
}

export default MyApp;
