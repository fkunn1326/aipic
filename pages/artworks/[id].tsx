import { useRouter } from "next/router";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import React, { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  HeartIcon,
  ArrowUpOnSquareIcon,
  EllipsisHorizontalIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  EyeIcon,
  ClipboardIcon,
} from "@heroicons/react/24/solid";
import ImageModal from "../../components/modal/imagemodel";
import Modal from "../../components/modal/modal";
import ShareModal from "../../components/modal/sharemodal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faLine,
} from "@fortawesome/free-brands-svg-icons";
import { userInfoContext } from "../../context/userInfoContext";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import PopOver from "../../components/popover";
import { text2Link } from "../../components/common/text2link";
import OtherImages from "../../components/common/OtherImages";
import FollowBtn from "../../components/common/follow";
import "@splidejs/react-splide/css/skyblue";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? `https://preview.aipic-dev.tk/api/artworks/${id}`
      : `https://aipic.vercel.app/api/artworks/${id}`
  );
  const data = await res.json();

  return {
    props: {
      data: data,
      host: context.req.headers.host || null,
    },
  };
};

const Meta = ({ data }) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <title>
        {data[0].title} - {data[0].author.name}の作品 - Aipic
      </title>
      <meta name="description" content={data[0].caption} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@fkunn1326" />
      <meta name="twitter:title" content={data[0].title} />
      <meta name="twitter:description" content={data[0].caption} />
      <meta property="og:site_name" content="AIPIC" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={`${data[0].author.name}`} />
      <meta property="og:description" content={data[0].caption} />
      <meta
        property="og:url"
        content={`https://aipic.vercel.app/artworks/${data[0].id}`}
      />
      <link
        rel="alternate"
        type="application/json+oembed"
        href={`https://www.aipic.app/api/oembed/${data[0].id}`}
      />
      {data[0].age_limit === "all" && (
        <meta name="twitter:image" content={data[0].href} />
      )}
      {data[0].age_limit === "all" && (
        <meta property="og:image" content={data[0].href} />
      )}
      <meta name="robots" content="index,follow" />
    </Head>
  );
};

const LikeBtn = ({ data }) => {
  const [isliked, setisliked] = useState(false);
  const [isfocus, setisfocus] = useState(true);
  const [image, setimage] = useState<any>({});
  const ctx = useContext(userInfoContext);
  const router = useRouter();

  useEffect(() => {
    setimage(data);
  }, []);

  const handlelike = async (e) => {
    if (ctx.UserInfo.id !== undefined) {
      if (isliked) {
        await supabaseClient.from("likes").delete().match({
          artwork_id: data.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(false);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            artwork_id: `${data.id}`,
            type: "delete",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await supabaseClient.from("likes").insert({
          artwork_id: data.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(true);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            artwork_id: `${data.id}`,
            type: "add",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  };

  return (
    <button className="w-8 h-8" onClick={(e) => handlelike(e)}>
      {isliked ? (
        <HeartSolidIcon className="w-8 h-8 text-pink-500" />
      ) : (
        <HeartIcon className="w-8 h-8 text-black dark:text-white" />
      )}
    </button>
  );
};

const Images = ({ data, host, children }) => {
  const ctx = useContext(userInfoContext);

  const [isImageOpen, setisImageOpen] = useState(false);
  const [isPromptOpen, setisPromptOpen] = useState(false);
  const [isShareOpen, setisShareOpen] = useState(false);
  const [splideindex, setsplideindex] = useState(0);

  const [limittype, setlimittype] = useState("");

  const router = useRouter();
  const pid = router.query.id;

  const uri = `https://${host}/artworks/${pid}`;

  const splideref = useRef<any>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
  };

  useEffect(() => {
    if (data !== undefined) {
      if (image !== undefined) {
        if (ctx.UserInfo.id === undefined) {
          setlimittype("unauth");
        } else {
          if (!ctx.UserInfo.access_limit[image.age_limit]) {
            setlimittype("unsafe");
          } else {
            setlimittype("ok");
          }
        }
        if (image.age_limit === "all") setlimittype("ok");
      }
    }
  }, [data, image, ctx]);

  useEffect(() => {
    if (localStorage.getItem("history") === null) {
      localStorage.setItem("history", JSON.stringify([data[0]]));
    } else {
      var localhistory = JSON.parse(localStorage.getItem("history") as string);
      var samehistory = localhistory.find((item) => item?.id === data[0]?.id);
      if (samehistory === undefined) {
        localhistory.push(data[0]);
        localStorage.setItem("history", JSON.stringify(localhistory));
      }
    }
    (async () => {
      try {
        await axios.post(
          "/api/views",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            artwork_id: `${data[0].id}`,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    splideref.current?.splide.on('move', function () {
      setsplideindex(
        splideref.current?.splide.index
      );
    });
  })

  const handlecopy = (text, id) => {
    const pre = document.createElement("pre");
    pre.style.webkitUserSelect = "auto";
    pre.style.userSelect = "auto";
    pre.textContent = text;
    document.body.appendChild(pre);
    document.getSelection()!.selectAllChildren(pre);
    const result = document.execCommand("copy");
    document.body.removeChild(pre);
    (async () => {
      await axios.post(
        "/api/copies",
        JSON.stringify({
          token: `${supabaseClient?.auth?.session()?.access_token}`,
          artwork_id: `${id}`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    })();
    return result;
  };

  const gethref = (str: string) => {
    if (str.endsWith("/public")) {
      return str.replace("/public", "/w=512");
    } else return str;
  };

  if (!data) return <div className="text-white">Loading...</div>;
  var image = data[0];
  if (!image) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-white dark:bg-slate-900">
      <Meta data={data} />
      <Header />
      <div className="overflow-x-hidden lg:px-12 grow w-full max-w-full min-h-0 min-w-0 shrink-0 flex-col basis-auto flex items-stretch">
        <div className="glow lg:mx-4 my-auto px-0 lg:my-auto lg:py-4 mb:my-auto mb:py-7">
          <div className="flex-nowrap flex-col">
            <main className="lg:pt-16 mb-16 flex-col lg:flex-row flex-nowrap items-start flex basis-auto">
              <div className="lg:mr-8 flex-col flex w-full basis-3/4 lg:border dark:border-slate-500 rounded-3xl">
                <div className="h-max w-full lg:py-12">
                  <div className="flex mb-8 relative h-[70vh] items-center w-full">
                    <div className="flex flex-col absolute inset-0 items-center justify-center">
                      <div className="flex relative flex-col-reverse z-auto h-full w-full">
                        <div
                          className={`relative h-full w-full box-content ${
                            limittype !== "ok" && "bg-neutral-400"
                          }`}
                          style={{
                            letterSpacing: 0,
                            wordSpacing: 0,
                            fontSize: 0,
                          }}
                        >
                          {limittype !== "unauth" && (
                            <Splide
                              role="group"
                              aria-label="Images"
                              className="h-[70vh] group"
                              tag="div"
                              hasTrack={false}
                              options={{ gap: 2 }}
                              ref={splideref}
                            >
                              <div>
                                <SplideTrack>
                                  {image.image_contents.map((img, idx) => (
                                    <SplideSlide
                                      className="relative w-full h-[70vh]"
                                      key={img?.id}
                                    >
                                      <img
                                        alt={img?.title}
                                        src={gethref(img?.href)}
                                        className={`rounded-t-3xl w-full h-full min-h-[70vh] z-10 object-contain ${
                                          limittype === "ok" && "cursor-zoom-in"
                                        } ${
                                          limittype === "unsafe" &&
                                          "blur-xl opacity-60 pointer-events-none"
                                        }`}
                                        onClick={() => {
                                          if (limittype === "ok")
                                            setisImageOpen(true);
                                        }}
                                      />
                                    </SplideSlide>
                                  ))}
                                </SplideTrack>
                                <div
                                  className={`transition-opacity ease-in-out delay-150 splide__arrows text-sm opacity-0 ${
                                    image?.images?.length > 1
                                      ? "group-hover:opacity-75"
                                      : ""
                                  }`}
                                />
                              </div>
                            </Splide>
                          )}
                          <ImageModal
                            isOpen={isImageOpen}
                            onClose={() => setisImageOpen(false)}
                          >
                            <div className="relative w-full h-full">
                              <img
                                src={gethref(image.image_contents[splideindex]?.href)}
                                className="rounded-lg w-full h-full min-h-[70vh] object-contain"
                                onClick={() => {
                                  setisImageOpen(false);
                                }}
                              />
                            </div>
                          </ImageModal>
                          {limittype === "unsafe" && (
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-auto z-50 pointer-events-auto">
                              <p className="text-xl text-white font-semibold">
                                {image.age_limit.toUpperCase()}
                                作品は、非表示に設定されています。
                              </p>
                              <Link href="/settings">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                  設定を変更する
                                </a>
                              </Link>
                            </div>
                          )}
                          {limittype === "unauth" && (
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-auto z-50 pointer-events-auto">
                              <p className="text-xl text-white font-semibold">
                                {image.age_limit.toUpperCase()}
                                作品を表示するには、ログインする必要があります。
                              </p>
                              <Link href="/signin">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                  サインイン
                                </a>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row mx-auto lg:mx-24 lg:justify-end flex-nowrap mt-6 w-10/12">
                    <div className="flex justify-between lg:justify-end w-full lg:flex-end flex-row flex-nowrap xl:px-6 lg:py-6 gap-4">
                      <button
                        className="h-8 xl:mr-2 text-black dark:text-white"
                        onClick={() => setisPromptOpen(true)}
                      >
                        プロンプトを表示する
                      </button>
                      <div className="flex w-max flex-row gap-4">
                        <Modal
                          isOpen={isPromptOpen}
                          onClose={() => setisPromptOpen(false)}
                        >
                          <div className="bg-slate-50 dark:bg-slate-600 p-8 rounded-3xl">
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                              使用モデル
                            </p>
                            <p className="mt-2 font-semibold text-2xl text-black dark:text-white">
                              {image.image_contents[splideindex]?.model}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-600 p-8 rounded-3xl mt-4">
                            <div className="flex justify-between">
                              <p className="text-gray-600 dark:text-slate-300 text-sm">
                                プロンプト
                              </p>
                              <button className="border dark:border-slate-400 rounded-lg hover:bg-gray-100 active:bg-gray-200 active:border-green-600">
                                <ClipboardDocumentIcon
                                  className="w-5 h-5 text-gray-600 dark:text-slate-400 m-2 break-all"
                                  onClick={() => {
                                    handlecopy(
                                      image.image_contents[splideindex]?.prompt,
                                      image.id
                                    );
                                  }}
                                />
                              </button>
                            </div>
                            <p
                              className="font-semibold"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {image.image_contents[splideindex]?.prompt
                                ?.split(",")
                                .map((i) => i.trim())
                                .map((str, idx) => (
                                  <a
                                    className="transition-color duration-200 ease-in-out hover:bg-sky-100 dark:hover:bg-slate-500 rounded-sm px-1 dark:text-white"
                                    key={idx}
                                  >
                                    {str}{" "}
                                  </a>
                                ))}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-600 p-8 rounded-3xl mt-4">
                            <div className="flex justify-between">
                              <p className="text-gray-600 dark:text-slate-300 text-sm">
                                ネガティブプロンプト
                              </p>
                              <button className="border dark:border-slate-400 rounded-lg hover:bg-gray-100 active:bg-gray-200 active:border-green-600">
                                <ClipboardDocumentIcon
                                  className="w-5 h-5 text-gray-600 dark:text-slate-400 m-2 break-all"
                                  onClick={() => {
                                    handlecopy(
                                      image.image_contents[splideindex]
                                        ?.nprompt,
                                      image.id
                                    );
                                  }}
                                />
                              </button>
                            </div>
                            <p
                              className="font-semibold"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {image.image_contents[splideindex]?.nprompt
                                ?.split(",")
                                .map((i) => i.trim())
                                .map((str, idx) => (
                                  <a
                                    className="transition-color duration-200 ease-in-out hover:bg-sky-100 dark:hover:bg-slate-500 rounded-sm px-1 dark:text-white"
                                    key={idx}
                                  >
                                    {str}
                                  </a>
                                ))}
                            </p>
                          </div>
                        </Modal>
                        <LikeBtn data={image}></LikeBtn>
                        <button
                          className="w-8 h-8"
                          onClick={() => setisShareOpen(true)}
                          title="共有する"
                        >
                          <ArrowUpOnSquareIcon className="w-8 h-8 text-black dark:text-white"></ArrowUpOnSquareIcon>
                        </button>
                        <ShareModal
                          isOpen={isShareOpen}
                          onClose={() => setisShareOpen(false)}
                        >
                          <div className="p-5 rounded-3xl">
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                              この作品を共有
                            </p>
                          </div>
                          <div className="grid grid-cols-4 gap-4 px-6">
                            <div className="flex flex-col items-center text-sm text-gray-700 dark:text-slate-300">
                              <a
                                className="group w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 dark:bg-slate-600 dark:hover:bg-slate-700 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                                href={`https://twitter.com/intent/tweet?text=${image.title}\n&url=${uri}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={faTwitter}
                                  className="w-7 h-7 group-hover:text-sky-500"
                                />
                              </a>
                              Twitter
                            </div>
                            <div className="flex flex-col items-center text-sm text-gray-700 dark:text-slate-300">
                              <a
                                className="group w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 dark:bg-slate-600 dark:hover:bg-slate-700 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                                href={`http://www.facebook.com/share.php?u=${uri}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={faFacebook}
                                  className="w-7 h-7 group-hover:text-blue-600"
                                />
                              </a>
                              Facebook
                            </div>
                            <div className="flex flex-col items-center text-sm text-gray-700 dark:text-slate-300">
                              <a
                                className="group w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 dark:bg-slate-600 dark:hover:bg-slate-700 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                                href={`https://social-plugins.line.me/lineit/share?url=${uri}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={faLine}
                                  className="w-7 h-7 group-hover:text-green-500"
                                />
                              </a>
                              LINE
                            </div>
                            <div className="flex flex-col items-center text-sm text-gray-700 dark:text-slate-300">
                              <button
                                className="group w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 dark:bg-slate-600 dark:hover:bg-slate-700 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 mb-1"
                                onClick={async () => {
                                  try {
                                    await navigator.share({
                                      title: image.title,
                                      url: uri,
                                    });
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                              >
                                <EllipsisHorizontalIcon className="w-7 h-7" />
                              </button>
                              その他
                            </div>
                          </div>
                          <div className="relative hidden-scrollbar">
                            <div className="m-6 h-14 rounded-2xl bg-slate-50 dark:bg-slate-600 dark:text-white flex items-center whitespace-nowrap overflow-x-scroll">
                              <p className="mx-4">{uri}</p>
                            </div>
                            <button className="absolute right-8 top-2 border rounded-lg bg-slate-50 dark:bg-slate-500 dark:border-slate-400 hover:bg-gray-100 active:bg-gray-200 active:border-green-600">
                              <ClipboardDocumentIcon
                                className="w-5 h-5 text-gray-600 dark:text-slate-300 m-2 "
                                onClick={() => {
                                  handlecopy(uri, image.id);
                                }}
                              />
                            </button>
                          </div>
                        </ShareModal>
                        <PopOver
                          id={image.id}
                          type={image.user_id === ctx.UserInfo.id}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex ml-8 lg:mx-24 lg:ml-12 justify-center">
                    <div className="flex flex-col w-[85vh] 2xl:w-[45vw]">
                      <h1
                        className="text-xl lg:text-2xl font-bold mt-18 text-black dark:text-white"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {image.title}
                      </h1>
                      <div
                        className="mt-5 text-sm lg:text-base text-black dark:text-slate-400"
                        dangerouslySetInnerHTML={{
                          __html: text2Link(image.caption),
                        }}
                      />
                      <div className="flex flex-row flex-wrap mt-5 text-sky-600 font-semibold text-sm lg:text-base">
                        {image.tags !== null &&
                          image.tags.map((tag, idx) => (
                            <Link
                              href={`/search/${tag}`}
                              key={idx}
                              style={{ overflowWrap: "anywhere" }}
                            >
                              <a className="mr-2">#{tag}</a>
                            </Link>
                          ))}
                      </div>
                      <div className="flex flex-row gap-x-4 items-center mt-4 text-sm text-gray-500 w-max">
                        <div className="flex flex-row items-center ">
                          <HeartSolidIcon
                            className="w-4 h-4 mr-1"
                            title="いいね"
                          />
                          {image.likes === null ? 0 : image.likes?.length}
                        </div>
                        <div
                          className="flex flex-row items-center"
                          title="閲覧数"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {image.views}
                        </div>
                        <div className="flex flex-row items-center">
                          <ClipboardIcon
                            className="w-4 h-4 mr-1"
                            title="コピー数"
                          />
                          {image.copies}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-[96px] w-full basis-1/4">
                <div className="flex shrink basis-full sticky min-w-[370px] max-h-[450px]">
                  <div className="flex flex-col flex-nowrap w-full ml-5 lg:ml-0">
                    <div className="mb-8 px-0 py-6">
                      <div className="mb-4 flex-col flex-nowrap">
                        <div className="flex mb-8 flex-col flex-nowrap">
                          <span className="mb-2">
                            <Link href={`/users/${image.author.uid}`}>
                              <a className="flex flex-row flex-nowrap items-center">
                                <img
                                  src={image.author.avatar_url}
                                  className="h-9 w-9 rounded-full"
                                ></img>
                                <p className="ml-2 font-semibold dark:text-white">
                                  {image.author.name}
                                </p>
                              </a>
                            </Link>
                          </span>
                          {image.user_id === ctx.UserInfo.id ? (
                            <Link href={`/edit/${image.id}`}>
                              <a
                                type="submit"
                                className={`w-full text-white bg-sky-500 rounded-full font-semibold text-sm my-5 px-5 py-2 text-center`}
                              >
                                編集する
                              </a>
                            </Link>
                          ) : (
                            <FollowBtn
                              following_uid={ctx.UserInfo.id}
                              followed_uid={image.user_id}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function App({ data, host, children }) {
  return (
    <Images data={data} host={host}>
      <div className="mx-auto max-w-7xl p-6 sm:px-12">
        <div className="text-xl font-semibold dark:text-white">
          その他の作品
        </div>
      </div>
      <OtherImages count={10} />
    </Images>
  );
}