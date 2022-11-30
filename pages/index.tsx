import React, { useState, useEffect, useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { userInfoContext } from "../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../components/common/BlurImage";
import SkeletonImage from "../components/common/SkeltonImage";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import DailyRanking from "../components/common/DailyRanking";
import TagsList from "../components/common/tags";
import TagImages from "../components/common/tagimages";
// import Challenge from "../components/common/challange";
// import ChallengeImages from "../components/common/challengeimages";
import Head from "next/head";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import Script from "next/script";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Meta = () => {
  return (
    <Head>
      <title>AIPIC</title>
      <meta
        name="description"
        content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@fkunn1326" />
      <meta name="twitter:title" content="AIPIC" />
      <meta name="twitter:image" content="" />
      <meta
        name="twitter:description"
        content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!"
      />
      <meta property="og:site_name" content="AIPIC" />
      <meta property="og:image" content="" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="AIPIC" />
      <meta
        property="og:description"
        content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!"
      />
      <meta property="og:url" content={`https://www.aipic.app`} />
      <meta name="robots" content="index,follow" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "http://www.aipic.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "http://www.aipic.app/search/{search_term}",
              "query-input": "required name=search_term"
            }
          }`
        }}
      />
    </Head>
  );
};

export const getServerSideProps  = async ({ req, res, locale }) => {
  const follows = await axios.get("https://preview.aipic-dev.tk/api/followimages/list", {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  const artworks = await axios.get("https://preview.aipic-dev.tk/api/artworks/list10", {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  const tags = await axios.get("https://preview.aipic-dev.tk/api/tags/list", {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
      artworks: artworks.data,
      followdata: follows.data,
      tags: tags.data
    },
    //オブジェクト返ってきてる
  }
};

export default function App({ artworks, followdata, tags }, ...props) {
  const { t } = useTranslation('common')
  const ctx = useContext(userInfoContext);
  const [disabled, setDisabled] = useState(true)

  const { data, error } = useSWR(
    "../api/artworks/list10",
    fetcher,
    {
      fallbackData: artworks,
    }
  );

  if (!(data && followdata))
    return (
      <div className="bg-white dark:bg-slate-900">
        <Meta />
        <Header></Header>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-white dark:bg-slate-900">
      <Meta />
      <Header></Header>
      <TagsList tags={tags} />
      {followdata.length > 0 && 
        <div>
          <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
            <div className="mt-6 text-xl font-semibold dark:text-white h-6">
              {ctx.UserInfo === false && t('おすすめ')}
              {ctx.UserInfo && t('フォローユーザーの作品')}
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
              {followdata?.map((image) => (
                <BlurImage key={image.id} image={image} />
              ))}
            </div>
          </div>
        </div>
      }
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            {t("新着")}
          </div>
          <Link href="/new">
            <a className="text-sky-600 dark:text-sky-400">
            {t('すべて見る')}
            </a>
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            {t('リリース記念！')}
          </div>
          <Link href="/special/aipic_release">
            <a className="text-sky-600 dark:text-sky-400">
            {t('すべて見る')}
            </a>
          </Link>
        </div>
      </div>
      <TagImages count={5} tag="AIPICリリース記念" />

      {/* <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold">
            今日のチャレンジ
          </div>
          <a className="text-sky-600">
            <Link href="/new">
              すべて見る
            </Link>
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          <Challenge />
          <ChallengeImages count={8}/>
        </div>
      </div> */}
      <div>
        <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
          <div className="mt-6 w-full flex flex-row justify-between">
            <div className="text-xl font-semibold text-black dark:text-white">
              {t('デイリーランキング')}
            </div>
            <Link href="/daily_ranking">
              <a className="text-sky-600 dark:text-sky-400">
                {t('すべて見る')}
              </a>
            </Link>
          </div>
        </div>
        <DailyRanking />
      </div>
      <button
        className="fixed right-8 bottom-8 md:right-12 md:bottom-12 transition-opacity duration-300 ease-out disabled:opacity-50"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpIcon className="w-12 h-12 bg-gray-400 text-white rounded-full p-3" />
      </button>
      <Footer />
    </div>
  );
}