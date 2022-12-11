import { useRouter } from "next/router";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import React, { useContext, useEffect, useRef, useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import {
  HeartIcon,
  ArrowUpOnSquareIcon,
  EllipsisHorizontalIcon,
  ClipboardDocumentIcon,
  FaceSmileIcon,
  PlusIcon
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
import PopOver from "../../components/popover";
import OtherImages from "../../components/common/OtherImages";
import FollowBtn from "../../components/common/follow";
import "@splidejs/react-splide/css/skyblue";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import BlurImage from "../../components/common/BlurImage";
import data from '@emoji-mart/data/sets/14/twitter.json'
import { v4 as uuidv4 } from "uuid";
import { Transition } from '@headlessui/react'
import { t } from "../../utils/Translation"

const EmojiPicker = (props: any) => {
  const ref = useRef<any>();
  const showEmojis = useRef(true);

  useEffect(() => {
    if (showEmojis.current) {
      showEmojis.current = false;
      import("emoji-mart").then((EmojiMart) => {
        new EmojiMart.Picker({ ...props, data, ref });
      });
    }
  }, [props]);

  return <div ref={ref} className={`transition-all duration-300 ease-in-out absolute bottom-12 ${props.place ? props.place : "right"}-0 z-50`} ></div>;
};

export const getServerSideProps = async ({ req, res, locale, query: { id } }) => {  
  const artwork = await fetch(`${process.env.BASE_URL}/api/artworks/${id}`, {
    credentials: "include",
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  const artwork_data = await artwork.json()

  const userid = artwork_data[0]?.author?.id

  const otherworks = await fetch(`${process.env.BASE_URL}/api/users/list5?id=${userid}`, {
    credentials: "include",
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  var profile: any = null

  try{
    profile = await fetch(`${process.env.BASE_URL}/api/auth/account`, {
      credentials: "include",
      headers: {
          Cookie: req?.headers?.cookie
      }
    })
  }catch(e){
    return {
      props: {
        data: artwork_data,
        otherdata: await otherworks.json() || [],
        host: req.headers.host || null,
      },
    };
  }

  return {
    props: {
      data: artwork_data,
      profile: await profile?.json(),
      otherdata: await otherworks.json() || [],
      host: req.headers.host || null,
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
      <meta name="note:card" content="summary_large_image"/>
      <meta property="og:site_name" content="AIPIC" />
      <meta property="og:type" content="website" />
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
      <link rel="canonical" href="https://www.aipic.app" />
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

const LikeBtn = ({ data, profile }) => {
  const [isliked, setisliked] = useState(false);

  useEffect(() => {
    if (profile?.id){
      if (data !== undefined) {
        data?.likes?.map((like) => {
          if (like.user_id === profile?.id) {
            setisliked(true);
          }
        });
      }
    }
  }, [data, profile]);

  const handlelike = async (e) => {
    if (profile?.id !== undefined) {
      if (isliked) {
        await supabaseClient.from("likes").delete().match({
          artwork_id: data.id,
          user_id: profile.id,
        });
        setisliked(false);
        await fetch(
          "/api/likes",
          {
            method: "post",
            body: JSON.stringify({
              artwork_id: `${data.id}`,
              type: "delete",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await supabaseClient.from("likes").upsert({
          artwork_id: data.id,
          user_id: profile.id,
        });
        setisliked(true);
        await fetch(
          "/api/likes",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              artwork_id: `${data.id}`,
              type: "add",
            }),
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

const Images = ({ data, host, profile, otherdata, children }, ...props) => {
  const [isImageOpen, setisImageOpen] = useState(false);
  const [isPromptOpen, setisPromptOpen] = useState(false);
  const [isShareOpen, setisShareOpen] = useState(false);
  const [isEmojiOpen, setisEmojiOpen] = useState(false);
  const [isAddEmojiOpen, setisAddEmojiOpen] = useState(false);
  const [splideindex, setsplideindex] = useState(0);

  const [emojilist, setemojilist] = useState<any[]>(data[0]?.emojis ? data[0]?.emojis : [])

  const emojis = {}

  emojilist.map((emoji) => {
    emojis[emoji.emoji_id] === undefined ? emojis[emoji.emoji_id] = [emoji.user_id] : emojis[emoji.emoji_id].push(emoji.user_id)
  })

  const [limittype, setlimittype] = useState("");

  const router = useRouter();
  const pid = router.query.id;

  const uri = `https://${host}/artworks/${pid}`;

  const splideref = useRef<any>(null);

  useEffect(() => {
    if (data !== undefined) {
      if (image !== undefined) {
        if (profile?.id === undefined) {
          setlimittype("unauth");
        } else {
          if (!profile?.access_limit[image.age_limit]) {
            setlimittype("unsafe");
          } else {
            setlimittype("ok");
          }
        }
        if (image.age_limit === "all") setlimittype("ok");
      }
    }
  }, [data, image]);

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
        await fetch(
          "/api/views",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              artwork_id: `${data[0].id}`,
            }),
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
      await fetch(
        "/api/copies",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artwork_id: `${id}`,
          }),
        }
      );
    })();
    return result;
  };

  const handleemojiselect = async (e) => {
    if (profile?.id !== undefined) {
      if(!emojis[e.shortcodes]?.includes(profile.id) || emojis[e.shortcodes] === undefined){
        const localemoji =  Object.assign( [], emojilist);
        localemoji.push({
          "id": uuidv4(),
          "user_id": profile?.id,
          "artwork_id": image?.id,
          "emoji_id": e.shortcodes
        })
        setemojilist(localemoji)
        await supabaseClient.from("emojis").upsert({
          "user_id": profile?.id,
          "artwork_id": image?.id,
          "emoji_id": e.shortcodes
        })
      }
    }
  }

  const handleemojiclick = async (name) => {
    if (profile?.id !== undefined) {
      var localemoji: any[] = Object.assign( [], emojilist);
      if(emojis[name].includes(profile?.id)){
        localemoji = localemoji.filter(emoji => !(emoji.user_id === profile?.id && emoji.emoji_id === name));
        setemojilist(localemoji)
        await supabaseClient.from("emojis").delete().match({
          "user_id": profile?.id,
          "artwork_id": image?.id,
          "emoji_id": name
        })
      }else{
        localemoji.push({
          "id": uuidv4(),
          "user_id": profile?.id,
          "artwork_id": image?.id,
          "emoji_id": name
        })
        setemojilist(localemoji)
        await supabaseClient.from("emojis").upsert({
          "user_id": profile?.id,
          "artwork_id": image?.id,
          "emoji_id": name
        })
      }
    }
  }

  const gethref = (str: string) => {
    if (str.endsWith("/public")) {
      return str.replace("/public", "/h=512");
    } else return str;
  };

  if (!data) return <div className="text-white">Loading...</div>;
  var image = data[0];
  if (!image) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-white dark:bg-slate-900">
      <Meta data={data} />
      <Header />
      <div className="hidden"><EmojiPicker/></div>
      <div className="overflow-x-hidden lg:px-12 grow w-full max-w-full min-h-0 min-w-0 shrink-0 flex-col basis-auto flex items-stretch">
        <div className="glow lg:mx-4 my-auto px-0 lg:my-auto lg:py-4 mb:my-auto mb:py-7">
          <div className="flex-nowrap flex-col">
            <main className="lg:pt-16 md:mb-16 flex-col lg:flex-row flex-nowrap items-start flex basis-auto">
              <div className="lg:mr-8 flex-col flex w-full basis-3/4 lg:border dark:border-slate-500 rounded-3xl">
                <div className="h-max w-full lg:py-12">
                  <div className="flex mb-8 relative h-[70vh] items-center w-full">
                    <div className="flex flex-col absolute inset-0 items-center justify-center mt-6 md:mt-0">
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
                                  {image.image_contents?.map((img, idx) => (
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
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-autopointer-events-auto">
                              <p className="text-xl text-white font-semibold">
                                {image.age_limit.toUpperCase()}
                                {t('ArtworkPage.ArtworkisUnshown','作品は、非表示に設定されています。')}
                              </p>
                              <Link href="/settings">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                  {t('ArtworkPage.ChengeSettings','設定を変更する')}
                                </a>
                              </Link>
                            </div>
                          )}
                          {limittype === "unauth" && (
                            <div className="flex flex-col gap-8 justify-center items-center absolute inset-0 m-auto z-50 pointer-events-auto">
                              <p className="text-xl text-white font-semibold">
                                {image.age_limit.toUpperCase()}
                                {t('ArtworkPage.RequireLogin','作品を表示するには、ログインする必要があります。')}
                              </p>
                              <Link href="/signin">
                                <a className="text-base text-white font-semibold py-4 px-12 border rounded-3xl cursor-pointer">
                                  {t('ArtworkPage.Signin','サインイン')}
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
                        {t('ArtworkPage.ShowPrompt','プロンプトを表示する')}
                      </button>
                      <div className="flex w-max flex-row gap-4">
                        <Modal
                          isOpen={isPromptOpen}
                          onClose={() => setisPromptOpen(false)}
                        >
                          <div className="bg-slate-50 dark:bg-slate-600 p-8 rounded-3xl">
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                              {t('ArtworkPage.UsedModel','使用モデル')}
                            </p>
                            <p className="mt-2 font-semibold text-2xl text-black dark:text-white">
                              {image.image_contents[splideindex]?.model}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-600 p-8 rounded-3xl mt-4">
                            <div className="flex justify-between">
                              <p className="text-gray-600 dark:text-slate-300 text-sm">
                                {t('ArtworkPage.Prompt','プロンプト')}
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
                                {t('ArtworkPage.NPrompt','ネガティブプロンプト')}
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
                        <LikeBtn data={image} profile={profile}></LikeBtn>
                        <button
                          className="w-8 h-8 relative z-10"
                          title={t('ArtworkPage.Emoji','絵文字')}
                        >
                          <FaceSmileIcon
                            className={
                              `w-8 h-8 transition-colors duration-100 ease-in-out
                                ${isEmojiOpen ? "text-sky-500" : "text-black dark:text-white"}
                              `}
                            onClick={(e) => setTimeout(() => {
                              setisEmojiOpen(!isEmojiOpen)}, 0)
                            }
                          />
                          <Transition
                            show={isEmojiOpen}
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <EmojiPicker 
                              data={data}
                              onClickOutside={() => setisEmojiOpen(false)}
                              onEmojiSelect={(e) => {handleemojiselect(e)}}
                              locale="ja"
                              place="drop-shadow-lg top-12 right-[-100px] md:right"
                              set="twitter"
                            />
                          </Transition>
                        </button>              
                        <button
                          className="w-8 h-8"
                          onClick={() => setisShareOpen(true)}
                          title={t('ArtworkPage.Share','共有する')}
                        >
                          <ArrowUpOnSquareIcon className="w-8 h-8 text-black dark:text-white"/>
                        </button>
                        <ShareModal
                          isOpen={isShareOpen}
                          onClose={() => setisShareOpen(false)}
                        >
                          <div className="p-5 rounded-3xl">
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                              {t('ArtworkPage.ShareArtwork','この作品を共有')}
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
                              {t('ArtworkPage.Other','その他')}
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
                          type={image.user_id === profile?.id}
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
                      >
                        {image?.caption?.split(/(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)/).map((v, i) =>
                          i & 1 ? (
                            <a className="text-sky-500 dark:text-sky-600" key={i} href={v} target="_blank" rel="noopener noreferrer">
                              {v}
                            </a>
                          ) : (
                            v
                          )
                        )}
                      </div>
                      {image.tags !== null &&
                        <div className="flex flex-row flex-wrap mt-5 text-sky-600 font-semibold text-sm lg:text-base">
                          {image.tags.map((tag, idx) => (
                            <Link
                              href={`/search/${tag}`}
                              key={idx}
                              style={{ overflowWrap: "anywhere" }}
                            >
                              <a className="mr-2">#{tag}</a>
                            </Link>
                          ))}
                        </div>
                      }
                      <div className="flex flex-row flex-wrap mt-5 gap-2">
                        {emojis !== null &&
                          Object.keys(emojis).map(name => {
                            return (
                              <button
                                key={name}
                                className={`rounded-full flex items-center gap-1 px-2 text-lg select-none [&>em-emoji>span]:flex [&>em-emoji>span]:items-center ${emojis[name].includes(profile?.id) ? "bg-sky-100 border-[1.5px] border-sky-500" : "bg-gray-100"}`}
                                onClick={() => {handleemojiclick(name)}}
                              >
                                {/* @ts-ignore */}
                                <em-emoji shortcodes={name} set="twitter" />
                                <p className="text-sm">{emojis[name]?.length}</p>
                              </button>
                            )
                          })
                        }
                        <button
                          className={`relative rounded-full flex items-center justify-center w-8 h-8 font-semibold select-none bg-gray-100 ${isEmojiOpen ? "" : "z-10"}`}
                          onClick={() => setTimeout(() => {
                            setisAddEmojiOpen(!isAddEmojiOpen)}, 0)
                          }
                        >
                          {/* @ts-ignore */}
                          <p
                            className="text-lg text-gray-700 m-3"
                          >+</p>
                          <Transition
                            show={isAddEmojiOpen}
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <EmojiPicker 
                              data={data}
                              onClickOutside={() => setisAddEmojiOpen(false)}
                              onEmojiSelect={(e) => {handleemojiselect(e)}}
                              locale="ja"
                              place="drop-shadow-lg top-12 left-0 md:right"
                              set="twitter"
                              autoFocus
                            />
                          </Transition>
                        </button>
                      </div>
                      <div className="flex flex-row gap-x-4 items-center mt-4 text-sm text-gray-500 w-max">
                        <div className="flex flex-row items-center ">
                          <HeartSolidIcon
                            className="w-4 h-4 mr-1"
                            title={t('ArtworkPage.Likes','いいね')}
                          />
                          {image.likes === null ? 0 : image.likes?.length}
                        </div>
                        <div
                          className="flex flex-row items-center"
                          title={t('ArtworkPage.VisitedCount','閲覧数')}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {image.views}
                        </div>
                        <div className="flex flex-row items-center">
                          <ClipboardIcon
                            className="w-4 h-4 mr-1"
                            title={t('ArtworkPage.CopyCount','コピー数')}
                          />
                          {image.copies}
                        </div>
                      </div>
                      <div className="mt-12 gap-x-5 hidden lg:flex flex-row flex-nowrap items-center">
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
                        <FollowBtn
                          following_uid={profile?.id}
                          followed_uid={image.user_id}
                        />
                      </div>
                      <div className="mt-6 grid-cols-5 gap-3 hidden lg:grid">
                        {otherdata?.map((artwork, idx) => (
                          <BlurImage image={artwork} key={artwork.id} preview />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="t-[96px] w-full basis-1/4">
                <div className="flex shrink basis-full sticky min-w-[370px] max-h-[450px]">
                  <div className="flex flex-col flex-nowrap w-full mx-5 lg:ml-0">
                    <div className="md:mb-8 px-0 py-6">
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
                            <p className="mt-4 mr-2 break-words text-sm dark:text-white">
                              {image.author?.introduce}
                            </p>
                            {image.user_id === profile?.id ? (
                              <Link href={`/edit/${image.id}`}>
                                <a
                                  type="submit"
                                  className={`w-full text-white bg-sky-500 rounded-full font-semibold text-sm my-5 px-5 py-2 text-center`}
                                >
                                  {t('ArtworkPage.Edit','編集する')}
                                </a>
                              </Link>
                            ) : (
                              <FollowBtn
                                following_uid={profile?.id}
                                followed_uid={image.user_id}
                              />
                            )}
                            <div className="mt-6 flex justify-between text-sm text-gray-600">
                              <p>{t('ArtworkPage.OtherArtworks','その他の作品')}</p>
                              <Link href={`/users/${image.author?.uid}`}>
                                <a className="text-sky-500 dark:text-sky-600">{t('ArtworkPage.ShowMore','もっと見る')}</a>
                              </Link>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-3">
                              {otherdata?.slice(0,3).map((artwork, idx) => (
                                <BlurImage image={artwork} key={artwork.id} preview />
                              ))}
                            </div>
                          </span>
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

export default function App({ data, host, otherdata, profile=false, children }, ...props) {
  return (
    <Images data={data} host={host} profile={profile} otherdata={otherdata}>
      <div className="mx-auto max-w-7xl p-6 sm:px-12">
        <div className="text-xl font-semibold dark:text-white">
          その他の作品
        </div>
      </div>
      <OtherImages count={10} />
    </Images>
  );
}
