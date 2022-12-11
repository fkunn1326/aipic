import Image from "next/image";
import React, { useContext } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import FollowBtn from "../../components/common/follow";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";
import Head from "next/head";
import axios from "axios";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const fetcher = (url) => fetch(url).then((r) => r.json());

export const getServerSideProps = async ({ req, res, locale, query: { id } }) => {  
  const user = await axios.get(`${process.env.BASE_URL}/api/users/${id}`, {
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
      data: user.data,
    },
  };
};

// const Meta = ({ data }) => {
//   return (
//     <Head>
//       <meta charSet="utf-8" />
//       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//       <meta name="viewport" content="width=device-width,initial-scale=1.0" />
//       <title>
//         {data[0].name} - AIPIC
//       </title>
//       <meta name="description" content={data[0].introduce} />
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:site" content="@fkunn1326" />
//       <meta name="twitter:title" content={`${data[0].name} - AIPIC`} />
//       <meta name="twitter:description" content={data[0].introduce} />
//       <meta name="note:card" content="summary_large_image"/>
//       <meta property="og:site_name" content="AIPIC" />
//       <meta property="og:type" content="website" />
//       <meta property="og:title" content={`${data[0].name} - AIPIC`} />
//       <meta property="og:description" content={data[0].introduce} />
//       <meta
//         property="og:url"
//         content={`https://aipic.vercel.app/artworks/${data[0].id}`}
//       />
//       <link rel="canonical" href="https://www.aipic.app" />
//       <meta name="twitter:image" content={data[0].href} />
//       <meta property="og:image" content={data[0].href} />
//       <meta name="robots" content="index,follow" />
//     </Head>
//   );
// };

const App = ({ data }, ...props) => {
  const router = useRouter();
  const ctx = useContext(userInfoContext);
  const { t } = useTranslation('common')

  const dummystr = t("UserPage.Dummy", "Dummy")

  const { id } = router.query;
  const page =
    router.query.page !== undefined ? parseInt(router.query.page as string) : 1;

  const { data: userData, error } = useSWR(
    `../api/users/${id}` + "?page=" + page, fetcher
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

  if (!userData) {
    return (
      <div className="dark:bg-slate-900">
        <Header></Header>
        <div className="relative w-full h-64 sm:h-96 p-4 sm:p-8 pb-12">
          <div className="w-full h-full">
            <div className="w-full h-full mx-auto rounded-3xl animate-pulse bg-gray-200"></div>
          </div>
          <div className="flex flex-row items-end absolute bottom-[-15px] left-8 sm:left-36">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-[3.5px]  border-white bg-gray-200 rounded-full">
              <div className="rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col mb-3 ml-5 font-semibold text-lg">
              <div className="ml-2 rounded-full bg-gray-200 h-5 w-32"></div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
      </div>
    );
  }

  const totalPage = Math.ceil(userData.count / 20);
  
  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="relative w-screen h-64 sm:h-96 p-4 sm:p-8 pb-12">
        <div className="relative w-full h-full">
          <Image
            src={userData.user?.header_url}
            layout="fill"
            objectFit="cover"
            className="w-full h-full mx-4 rounded-3xl"
          />
        </div>
        <div className="flex flex-col w-5/6 absolute bottom-[-100px] sm:bottom-[-120px] mx-4 sm:left-36">
          <div className="flex flex-row justify-between sm:justify-start w-full items-end">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-[3.5px]  border-white rounded-full">
              <Image
                src={userData.user?.avatar_url}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col mb-1 ml-5 font-semibold text-lg dark:text-white">
              <h1>{userData.user?.name}</h1>
            </div>
            {userData.user?.id !== ctx.UserInfo?.id &&
              <div className="grid sm:flex sm:flex-row mb-[-1.3rem] ml-5 text-sm text-gray-700">
                <FollowBtn
                  following_uid={ctx.UserInfo?.id}
                  followed_uid={userData.user?.id}
                />
              </div>
            }
          </div>
          <div className="flex sm:hidden flex-col mt-3 font-semibold text-lg ">
            <h1 className="line-clamp-1 dark:text-white">{userData.user?.name}</h1>
          </div>
          <div className="py-2 sm:py-6 max-w-xl sm:max-w-full">
            <div
              className="line-clamp-2 dark:text-slate-300"
            >
              {userData.user?.introduce?.split(/(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)/).map((v, i) =>
                i & 1 ? (
                  <a className="text-sky-500 dark:text-sky-600" key={i} href={v} target="_blank" rel="noopener noreferrer">
                    {v}
                  </a>
                ) : (
                  v
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl pt-28 px-4 sm:pt-32 sm:px-6 lg:max-w-7xl lg:px-8 mb-12">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {userData.body?.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-x-4 text-lg">
        {getpagenation().map((count, idx) => (
          <Link
            href={`${
              count !== "..." ? `/users/${userData.user?.uid}/?page=${count}` : `/users/${userData.user?.uid}/?page=${page}`
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

export default App