import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import BlurImage from "../components/common/BlurImage";
import SkeletonImage from "../components/common/SkeltonImage";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps = async ({ req, res, locale }) => {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
    },
  }
}

export default function App(...props) {
  const [data, setdata] = useState<any[]>([]);
  const { t } = useTranslation('common')

  useEffect(() => {
    if (localStorage.getItem("history") !== null) {
      setdata(JSON.parse(localStorage.getItem("history") as string));
    }
  }, []);

  const router = useRouter();

  const handleclear = (e) => {
    localStorage.setItem("history", JSON.stringify([]));
    router.push("/");
  };

  if (!data)
    return (
      <div className="dark:bg-slate-900">
        <Header></Header>
        <div className="mx-auto max-w-7xl flex px-6 sm:px-12">
          <div className="pt-6 text-2xl font-semibold">履歴を削除</div>
        </div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
        <Footer />
      </div>
    );
  var images = data.slice(0, data.length);
  images = images.filter(Boolean)
  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="pt-6 flex flex-row items-center mx-auto max-w-7xl px-6 sm:px-12">
        <div className="text-2xl font-semibold dark:text-white">閲覧履歴</div>
        <button
          className="ml-4 text-sm border transition-colors ease-in-out duration-300 text-sky-500 border-sky-500 hover:bg-sky-500 hover:text-white rounded-xl px-2 py-1"
          onClick={(e) => {
            handleclear(e);
          }}
        >
          履歴を削除
        </button>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {images.reverse().map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
