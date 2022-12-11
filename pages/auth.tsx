import { supabaseClient } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHash } from "../components/hooks/useHash";
import { setCookie } from "nookies";
import { SiteName } from "../components/core/const";
<<<<<<< HEAD
import { t } from "../utils/Translation"


export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
    },
  }
}

const AuthPage = (...props) => {
=======

const AuthPage = () => {
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)
  const [hash, setHash] = useHash();
  const [isok, setisok] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      hash.startsWith("access_token=") ? setisok(true) : setisok(false);
      if (isok) {
        var sb_access_token = hash.split("&")[0].split("=")[1];
        var sb_provider_token = hash.split("&")[2].split("=")[1];
        var sb_refresh_token = hash.split("&")[3].split("=")[1];
        setCookie(null, "sb-access-token", sb_access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          SameSite: "Lax",
        });
        setCookie(null, "sb-provider-token", sb_provider_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          SameSite: "Lax",
        });
        setCookie(null, "sb-refresh-token", sb_refresh_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          SameSite: "Lax",
        });
      }
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
                ? "ログインに成功しました"
                : "ログイン中にエラーが発生しました。"}
            </h1>
            <p className="text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              リダイレクトしています...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
