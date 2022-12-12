import React, { useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const fetcher = (url) => fetch(url).then((r) => r.json());

export const getServerSideProps  = async ({ req, res, locale, query: { page, keyword } }) => {
  const search = await fetch(`${process.env.BASE_URL}/api/search/?keyword=${keyword}&page=${page ? page : 1}`, {
    credentials: 'include',
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
      search: await search.json(),
    },
  }
};

export default function App({ search }, ...props) {
  const { t } = useTranslation('common')
  const router = useRouter();
  const page =
    router.query.page !== undefined ? parseInt(router.query.page as string) : 1;
  const { keyword } = router.query;

  useEffect(() => {
    var el = document.getElementById("searchbox") as HTMLInputElement;
    el.value = keyword as string;
  }, [router.isReady]);

  const { data, error } = useSWR(
    `${process.env.BASE_URL}/api/search` + "?keyword=" + keyword + "&page=" + page,
    fetcher,
    {
      fallbackData: search,
    }
  );

  const getpagenation = () => {
    var startPage = page - 2;
    var endPage = page + 2;
    var arr: any[] = [];

    if (startPage <= 0) {
      endPage -= startPage - 1;
      startPage = 1;
    }

    if (endPage > totalPage) endPage = totalPage;

    if (startPage > 1) arr.push("...");
    for (var i = startPage; i <= endPage; i++) arr.push(i);
    if (endPage < totalPage) arr.push("...");
    if (endPage < totalPage) arr.push(totalPage);
    if (startPage > 1 && endPage < totalPage) arr.splice(0, 1);

    return arr;
  };

  const count = data?.count;

  if (!(data && data?.count !== undefined))
    return (
      <div className="bg-white dark:bg-slate-900">
        <Header></Header>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(20)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
        <Footer />
      </div>
    );

  const totalPage = Math.ceil(data.count / 20);

  return (
    <div className="bg-white dark:bg-slate-900">
      <Header></Header>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold dark:text-white">
            {t('SearchPage.Title',"{{keyword}} の検索結果: {{count}}件", { keyword: keyword, count: count })}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data?.body?.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <button
        className="fixed right-0 bottom-0"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpIcon className="w-12 h-12 bg-gray-400 text-white rounded-full p-3 m-12" />
      </button>
      <div className="flex justify-center gap-x-4 text-lg">
        {getpagenation().map((count, idx) => (
          <Link
            href={`${
              count !== "..."
                ? `/search/${keyword}/?page=${count}`
                : `/new?page=${page}`
            }`}
            key={idx}
          >
            <button
              key={idx}
              className={`w-10 h-10 border dark:text-white rounded-lg  ${
                page === count && "bg-sky-500 border-none text-white"
              }`}
            >
              {count}
            </button>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
