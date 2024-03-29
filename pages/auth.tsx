import { supabaseClient } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHash } from "../components/hooks/useHash";
import { setCookie } from "nookies";
import { SiteName } from "../components/core/const";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
    },
  }
}

const AuthPage = (...props) => {
  const [hash, setHash] = useHash();
  const [isok, setisok] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common')

  useEffect(() => {
    if (router.isReady) {
      hash.startsWith("access_token=") ? setisok(true) : setisok(false);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 pt-10 h-screen">
      <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-full lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          {SiteName}
        </a>
        <div className="w-full bg-white dark:bg-slate-800 dark:border-slate-600 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              {isok
                ? t('AuthPage.LoginSuccess',"ログインに成功しました")
                : t('AuthPage.LoginError',"ログイン中にエラーが発生しました。")}
            </h1>
            <p className="text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              {t('AuthPage.Redirecting','リダイレクトしています...')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
