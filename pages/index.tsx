import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { userInfoContext } from "../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../components/common/BlurImage"
import SkeletonImage from "../components/common/SkeltonImage"
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import OtherImages from "../components/common/images";
import DailyRanking from "../components/common/DailyRanking"
import TagsList from "../components/common/tags"
import TagImages from "../components/common/tagimages"
import Challenge from "../components/common/challange"
import ChallengeImages from "../components/common/challengeimages"
import Head from "next/head";
import { useTranslation, Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from "next";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Meta = () => {
  return (
    <Head>
      <title>AIPIC</title>
      <meta name="description" content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@fkunn1326" />
      <meta name="twitter:title" content="AIPIC" />
      <meta name="twitter:image" content="" />
      <meta name="twitter:description" content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!" />
      <meta property="og:site_name" content="AIPIC"  />
      <meta property="og:image" content="" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="AIPIC" />
      <meta property="og:description" content="AIPIC（あいぴく）は、🧙AIを利用して創られた🎨イラスト作品🖼の投稿サイトです!" />
      <meta property="og:url" content={`https://www.aipic.app`}/>
      <meta name="robots" content="index,follow" />
    </Head>
  )
}

export default function App(_props) {
  var ctx = useContext(userInfoContext);
  var access_limit = ""
  const router = useRouter();
  const [follows, setfollows] = useState("()")
  const [isloading, setisloading] = useState(false);
  const { t } = useTranslation('home')

  if (ctx.UserInfo !== null) {
    access_limit = "?" + new URLSearchParams(ctx.UserInfo.access_limit).toString()
  }

  useEffect(() => {
    var followarr: any[] = [];
    try{
      (async() => {
        const {data, error} = await supabaseClient.from("follows").select("*").eq("following_uid", ctx.UserInfo.id)
        data?.map(id => {
          followarr.push(id["followed_uid"])
        })
        setfollows(`(${followarr.join(",")})`)
      })()
    }catch(e){;}
  },[ctx, isloading])


  const { data, error } = useSWR(
    "../api/images/list10" + access_limit,
     fetcher,
     {
        fallbackData: [],
     }
  );

  const { data: followdata, error:followerror } = useSWR(
    follows !== undefined ? "../api/followimages/list" + access_limit + "&" + new URLSearchParams({"follows": follows}).toString() : null,
    fetcher
  )

  if (!(data && followdata))
    return (
      <div className="bg-white dark:bg-slate-900">
        <Meta/>
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
      <Meta/>
      <Header></Header>
      <TagsList/>
      {follows !== "()" ?
      <div>   
        <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
          <div className="mt-6 text-xl font-semibold dark:text-white">
            {t("フォローユーザーの作品")}
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {followdata.map((image) => (
              <BlurImage key={image.id} image={image} />
            ))}
          </div>
        </div>
      </div>
      :
      <div>   
        <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
          <div className="mt-6 text-xl font-semibold text-black dark:text-white">
            おすすめ
          </div>
        </div>
        <OtherImages count={5} />
      </div>
      }
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            新着
          </div>
          <a className="text-sky-600 dark:text-sky-400">
            <Link href="/new">
              すべて見る
            </Link>
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold text-black dark:text-white">
            リリース記念！
          </div>
          <a className="text-sky-600 dark:text-sky-400">
            <Link href="/special/aipic_release">
              すべて見る
            </Link>
          </a>
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
              デイリーランキング
            </div>
            <a className="text-sky-600 dark:text-sky-400">
              <Link href="/daily_ranking">
                すべて見る
              </Link>
            </a>
          </div>
        </div>
        <DailyRanking />
      </div>
      <button className="fixed right-0 bottom-0" onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'})}}>
        <ArrowUpIcon className="w-12 h-12 bg-gray-400 text-white rounded-full p-3 m-12" />
      </button>
      <Footer/>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'ja', ['common', 'home']),
  },
})