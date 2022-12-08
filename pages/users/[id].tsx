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
import { supabaseClient } from "../../utils/supabaseClient";
import axios from "axios";
import FollowBtn from "../../components/common/follow";
import { text2Link } from "../../components/common/text2link";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";

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

  const { id } = router.query;
  const page =
    router.query.page !== undefined ? parseInt(router.query.page as string) : 1;

  const { data, error } = useSWR(
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

  useEffect(() => {
    if (data) {
      setname(data.name);
      setintro(data.introduce);
      setavatarurl(data.avatar_url);
      setheaderurl(data.header_url);
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
    setname(data.name);
    setintro(data.introduce);
    setavatarurl(data.avatar_url);
    setheaderurl(data.header_url);
    setIsEdited(false);
    setIsOpen(false);
  };

  const handleconfirm = async (e) => {
    e.preventDefault();
    setIsEdited(false);
    if (avatar !== undefined) {
      var formdata = new FormData();
      formdata.append("name", data.id);
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
          avatar_url: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/avatars/${data.id}.png`,
        })
        .match({
          id: data.id,
        });
    }
    if (header !== undefined) {
      var formdata = new FormData();
      formdata.append("name", data.id);
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
          header_url: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/headers/${data.id}.png`,
        })
        .match({
          id: data.id,
        });
    }
    await supabaseClient
      .from("profiles")
      .update({
        name: name,
        introduce: intro,
      })
      .match({
        id: data.id,
      });

    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  if (!data) {
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

  const totalPage = Math.ceil(data.count / 20);
  
  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="relative w-screen h-64 sm:h-96 p-4 sm:p-8 pb-12">
        <div className="relative w-full h-full">
          <Image
            src={data.user?.header_url}
            layout="fill"
            objectFit="cover"
            className="w-full h-full mx-4 rounded-3xl"
          />
        </div>
        <div className="flex flex-col w-5/6 absolute bottom-[-100px] sm:bottom-[-120px] mx-4 sm:left-36">
          <div className="flex flex-row justify-between sm:justify-start w-full items-end">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-[3.5px]  border-white rounded-full">
              <Image
                src={data.user?.avatar_url}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col mb-1 ml-5 font-semibold text-lg dark:text-white">
              <h1>{data.user?.name}</h1>
            </div>
            {data.user?.id !== ctx.UserInfo?.id &&
              <div className="grid sm:flex sm:flex-row mb-[-1.3rem] ml-5 text-sm text-gray-700">
                <FollowBtn
                  following_uid={ctx.UserInfo?.id}
                  followed_uid={data.id}
                />
              </div>
            }
          </div>
          <div className="flex sm:hidden flex-col mt-3 font-semibold text-lg ">
            <h1 className="line-clamp-1 dark:text-white">{data.user?.name}</h1>
          </div>
          <div className="py-2 sm:py-6 max-w-xl sm:max-w-full">
            <div
              className="line-clamp-2 dark:text-slate-300"
            >
              {data.user?.introduce?.split(/(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)/).map((v, i) =>
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
          {data.body?.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-x-4 text-lg">
        {getpagenation().map((count, idx) => (
          <Link
            href={`${
              count !== "..." ? `/users/${data.user?.uid}/?page=${count}` : `/users/${data.user?.uid}/?page=${page}`
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
