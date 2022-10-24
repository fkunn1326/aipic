import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import UserInfoProvider from '../components/auth/userInfoProvider'
import useTransition from "../components/hooks/useTransition";
import CummonHead from '../components/head'

function MyApp({ Component, pageProps }: AppProps) {
  useTransition();
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <UserInfoProvider>
        <CummonHead 
            title={'AI Arts'}
        />
        <Component {...pageProps} />
      </UserInfoProvider>
    </UserProvider>
  )
}

export default MyApp