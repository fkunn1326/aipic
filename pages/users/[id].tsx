import Image from "next/image";
import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import SettingModal from "../../components/modal/settingmodal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import FollowBtn from "../../components/common/follow";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setname] = useState<string>("");
  const [intro, setintro] = useState<string>("");
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [headerurl, setheaderurl] = useState<string>("");
  const [avatarurl, setavatarurl] = useState<string>("");
  const [header, setheader] = useState<Blob>();
  const [avatar, setavatar] = useState<Blob>();

  const router = useRouter();
  const ctx = useContext(userInfoContext);

  const { id }: any = router.query;
  const { data, error } = useSWR(
    `../api/users/${id}?` +
      new URLSearchParams(ctx.UserInfo.access_limit).toString(),
    fetcher
  );

  useEffect(() => {
    if (data) {
      setname(data[0].name);
      setintro(data[0].introduce);
      setavatarurl(data[0].avatar_url);
      setheaderurl(data[0].header_url);
    }
  }, [data]);

  const handlenamechange = (e) => {
    setname(e.target.value);
    setIsEdited(true);
  };

  const handleintrochange = (e) => {
    setintro(e.target.value);
    setIsEdited(true);
  };

  const handleheaderclick = (e) => {
    var headerinput = document.getElementById("header") as HTMLInputElement;
    headerinput.click();
  };

  const handleavatarclick = (e) => {
    var avatarinput = document.getElementById("avatar") as HTMLInputElement;
    avatarinput.click();
  };

  const handleavatarchange = (e) => {
    var file = new Blob([e.target.files[0]], { type: e.target.files[0].type });
    setavatar(file);
    setavatarurl(URL.createObjectURL(file));
    setIsEdited(true);
  };

  const handleheaderchange = (e) => {
    var file = new Blob([e.target.files[0]], { type: e.target.files[0].type });
    setheader(file);
    setheaderurl(URL.createObjectURL(file));
    setIsEdited(true);
  };

  const handlecancel = () => {
    setname(data[0].name);
    setintro(data[0].introduce);
    setavatarurl(data[0].avatar_url);
    setheaderurl(data[0].header_url);
    setIsEdited(false);
    setIsOpen(false);
  };

  const handleconfirm = async (e) => {
    e.preventDefault();
    setIsEdited(false);
    if (avatar !== undefined) {
      var formdata = new FormData();
      formdata.append("name", data[0].id);
      formdata.append("type", avatar.type);
      formdata.append("file", avatar);
      await axios.post("/api/r2/avatarupload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await supabaseClient
        .from("profiles")
        .update({
          avatar_url: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/avatars/${data[0].id}.png`,
        })
        .match({
          id: data[0].id,
        });
    }
    if (header !== undefined) {
      var formdata = new FormData();
      formdata.append("name", data[0].id);
      formdata.append("type", header.type);
      formdata.append("file", header);
      await axios.post("/api/r2/headerupload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await supabaseClient
        .from("profiles")
        .update({
          header_url: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/headers/${data[0].id}.png`,
        })
        .match({
          id: data[0].id,
        });
    }
    await supabaseClient
      .from("profiles")
      .update({
        name: name,
        introduce: intro,
      })
      .match({
        id: data[0].id,
      });

    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  if (!data) {
    return (
      <div className="dark:bg-slate-900">
        <Header></Header>
        <div className="relative w-screen h-64 sm:h-96 p-4 sm:p-8 pb-12">
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

  var images = data[0].artworks?.slice(0, data[0]?.artworks?.length);
  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="relative w-screen h-64 sm:h-96 p-4 sm:p-8 pb-12">
        <div className="relative w-full h-full">
          <Image
            src={data[0].header_url}
            layout="fill"
            objectFit="cover"
            className="w-full h-full mx-4 rounded-3xl"
          />
        </div>
        <div className="flex flex-col w-5/6 absolute bottom-[-100px] sm:bottom-[-120px] mx-4 sm:left-36">
          <div className="flex flex-row justify-between sm:justify-start w-full items-end">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-[3.5px]  border-white rounded-full">
              <Image
                src={data[0].avatar_url}
                layout="fill"
                objectFit="contain"
                className="rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col mb-1 ml-5 font-semibold text-lg dark:text-white">
              <h1>{data[0].name}</h1>
            </div>
            {data[0].id === ctx.UserInfo.id ? (
              <div className="mb-2 sm:mb-1 ml-5 font-semibold text-base rounded-full border-2 border-slate-200 px-4 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-600 dark:border-none">
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  className="hidden sm:flex dark:text-white"
                >
                  プロフィールを編集
                </button>
                <PencilSquareIcon
                  className="w-4 h-4 text-gray-400 sm:hidden"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                />
                <SettingModal isOpen={isOpen} onClose={() => handlecancel()}>
                  <div className="flex flex-col justify-center gap-y-8">
                    <h1 className="ml-2 text-base font-semibold dark:text-white">
                      プロフィールを編集
                    </h1>
                    <div className="relative w-full h-36 sm:h-64">
                      <button
                        className="group relative w-full h-full flex items-center text-center justify-center"
                        onClick={(e) => {
                          handleheaderclick(e);
                        }}
                      >
                        <Image
                          src={headerurl}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full rounded-xl"
                        />
                        <input
                          type="file"
                          id="header"
                          className="hidden"
                          onChange={(e) => {
                            handleheaderchange(e);
                          }}
                        />
                        <div className="transition-opacity ease-in duration-75 absolute w-full h-full bg-slate-600 opacity-0 rounded-xl z-10 group-hover:opacity-75"></div>
                        <p className="transition-opacity ease-in duration-75 absolute z-20 text-sm text-white font-semibold opacity-0 group-hover:opacity-100">
                          ヘッダーを変更
                        </p>
                      </button>
                      <button
                        className="group flex flex-row items-end absolute bottom-[-50px] left-8"
                        onClick={(e) => {
                          handleavatarclick(e);
                        }}
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-[3.5px] border-white rounded-full flex items-center text-center justify-center">
                          <Image
                            src={avatarurl}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-full z-30"
                          />
                          <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            onChange={(e) => {
                              handleavatarchange(e);
                            }}
                          />
                          <div className="transition-opacity ease-in duration-75 absolute w-full h-full bg-slate-600 opacity-0 rounded-full z-40 group-hover:opacity-75"></div>
                          <p className="transition-opacity ease-in duration-75 absolute z-50 text-sm text-white font-semibold opacity-0 group-hover:opacity-100">
                            アバターを
                            <br />
                            変更
                          </p>
                        </div>
                      </button>
                    </div>
                    <div>
                      <h2 className="mt-10 ml-2 font-semibold dark:text-slate-300">
                        ニックネーム
                      </h2>
                      <input
                        className="ml-1 mt-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-sky-600 focus:border-sky-600 block p-2.5 w-full dark:bg-slate-800 dark:border-none dark:text-white"
                        onChange={(e) => {
                          handlenamechange(e);
                        }}
                        value={name}
                        required
                        spellCheck="false"
                      ></input>
                    </div>
                    <div>
                      <h2 className="ml-2 font-semibold dark:text-slate-300">
                        自己紹介
                      </h2>
                      <textarea
                        className="ml-1 mt-3 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-32 w-full p-2.5 resize-none dark:bg-slate-800 dark:border-none dark:text-white"
                        onChange={(e) => {
                          handleintrochange(e);
                        }}
                        id="prompt"
                        value={intro}
                        required
                        spellCheck="false"
                      ></textarea>
                    </div>
                    <div>
                      <div className="ml-2 flex items-center">
                        <button
                          type="button"
                          disabled={!isEdited}
                          onClick={(e) => {
                            handleconfirm(e);
                          }}
                          className="font-medium rounded-lg text-sm px-3 py-1.5 text-center text-white bg-sky-500 disabled:bg-sky-300 disabled:cursor-no-drop"
                        >
                          変更を保存する
                        </button>
                        <button
                          type="button"
                          disabled={!isEdited}
                          onClick={() => handlecancel()}
                          className="ml-2 font-medium rounded-lg text-sm px-3 py-1.5 text-center border border-sky-500 text-sky-500 hover:text-white hover:bg-sky-500 disabled:text-sky-300 disabled:bg-white disabled:cursor-no-drop"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                </SettingModal>
              </div>
            ) : (
              <div className="grid sm:flex sm:flex-row mb-[-1.3rem] ml-5 text-sm text-gray-700">
                <FollowBtn
                  following_uid={ctx.UserInfo.id}
                  followed_uid={data[0].id}
                />
              </div>
            )}
          </div>
          <div className="flex sm:hidden flex-col mt-3 font-semibold text-lg ">
            <h1 className="line-clamp-1 dark:text-white">{data[0].name}</h1>
          </div>
          <div className="py-2 sm:py-6 max-w-xl sm:max-w-full">
            <h1 className="line-clamp-2 dark:text-slate-300">
              {data[0].introduce}
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl py-28 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {images.reverse().map((image) => (
            <BlurImage key={image.id} image={image} data={data[0]} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function BlurImage({ image, data }) {
  const ctx = useContext(userInfoContext);

  const [isLoading, setLoading] = useState(true);
  const [isliked, setisliked] = useState(false);

  const handlelike = async (e) => {
    if (ctx.UserInfo.id !== undefined) {
      if (isliked) {
        await supabaseClient.from("likes").delete().match({
          artwork_id: image.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(false);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            artwork_id: `${image.id}`,
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
          artwork_id: image.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(true);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.session()?.access_token}`,
            artwork_id: `${image.id}`,
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

  useEffect(() => {
    if (image !== undefined) {
      image.likes.map((like) => {
        if (like.user_id === ctx.UserInfo.id) setisliked(true);
      });
    }
  }, [image, ctx]);

  return (
    <div className="group">
      <div className="relative">
        <div className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Link href={`/artworks/${image.id}`}>
            <a>
              <Image
                alt={image.title}
                src={image.href}
                layout="fill"
                objectFit="cover"
                priority={true}
                sizes="(max-width: 768px) 50vw,
                (max-width: 1200px) 30vw,
                20vw"
                className={cn(
                  "duration-700 ease-in-out group-hover:opacity-75",
                  isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                  // image.age_limit !== 'all'
                  //   ? 'blur-md'
                  //   : ''
                )}
                onLoadingComplete={() => {
                  setLoading(false);
                }}
              />
            </a>
          </Link>
        </div>
        {image.age_limit === "nsfw" && (
          <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            NSFW
          </p>
        )}
        {image.age_limit === "r18" && (
          <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            R-18
          </p>
        )}
        {image.age_limit === "r18g" && (
          <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            R-18G
          </p>
        )}
        <button
          className="absolute bottom-1 right-1 text-sm font-semibold px-2 rounded-md"
          onClick={(e) => handlelike(e)}
        >
          {isliked ? (
            <HeartSolidIcon className="w-8 h-8 text-pink-500"></HeartSolidIcon>
          ) : (
            <HeartIcon className="w-8 h-8 fill-white"></HeartIcon>
          )}
        </button>
      </div>
      <p className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-50 text-ellipsis whitespace-nowrap overflow-hidden">
        {image.title}
      </p>
      <Link href={`/users/${data.uid}`}>
        <a className="mt-1 w-full flex items-center">
          <Image
            src={data.avatar_url}
            width={20}
            height={20}
            className="rounded-full"
          ></Image>
          <h3 className="ml-2 text-base text-gray-700 dark:text-slate-300">
            {data.name}
          </h3>
        </a>
      </Link>
    </div>
  );
}

function SkeletonImage() {
  return (
    <div className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
      <div className="mt-2 rounded-full bg-gray-200 h-3 w-32"></div>
      <div className="mt-1 w-full flex items-center">
        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
        <div className="ml-2 rounded-full bg-gray-200 h-3 w-16"></div>
      </div>
    </div>
  );
}
