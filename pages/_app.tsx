import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import UserInfoProvider from "../components/auth/userInfoProvider";
import useTransition from "../components/hooks/useTransition";
import { SiteName } from "../components/core/const"
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  useTransition();
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <UserInfoProvider>
        <Component {...pageProps} />
      </UserInfoProvider>
    </UserProvider>
  );
}

export default appWithTranslation(MyApp);