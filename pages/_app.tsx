import "../styles/globals.css";
import React from "react";
import UserInfoProvider from "../components/auth/userInfoProvider";
import useTransition from "../components/hooks/useTransition";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { GATracking } from "../components/GaTracking";
import axios from "axios";
import '../styles/crop.scss';

export const getServerSideProps  = async ({ req, res, locale }) => {
  const account = await axios.get(`${process.env.BASE_URL}/api/auth/account`, {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      account: account.data,
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

export default appWithTranslation(MyApp);
