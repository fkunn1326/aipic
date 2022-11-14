import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Dropdown from "./dropdown";
import Sidebar from "./sidebar";
import { userInfoContext } from "../../context/userInfoContext";
import {
  Bars3Icon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/solid";
import Sideblur from "./sideblur"
import { SiteName } from "../core/const"
import { useRouter } from "next/router";

const Header = () => {
  const ctx = useContext(userInfoContext);
  const router = useRouter()

  const [update, setUpdate] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showsearch, setshowsearch] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault()
    if (e.target.children[0].value !== "") router.push(`/search/${e.target.children[0].value}`)
  }

  return (
    <div
      className="relative bg-white border-b"
      onLoad={() => setUpdate(update ? false : true)}
    >
      <div onClick={() => {setShowSidebar(!showSidebar)}} className={`${!showSidebar && "pointer-events-none"}`}>
        <Sideblur isOpen={showSidebar} />
      </div>
      <div className="mx-auto px-4 md:px-8 max-w-xl mb:px-0 sm:max-w-7xl">
        <div className="md:flex md:items-center md:justify-between py-3 md:space-x-10">
          <div className="flex justify-between items-center lg:flex-none">
            <div className="flex justify-start items-center lg:flex-none">
              <div className="md:hidden mr-5 flex items-center">
                <button onClick={() => {setShowSidebar(!showSidebar)}}>
                  <Bars3Icon className="w-6 h-6"/>
                </button>
              </div>
              <Link href="/">
                <p className="cursor-pointer text-2xl">{SiteName}</p>
              </Link>
            </div>
            <div className="md:hidden mr-5 flex items-center">
              <button onClick={() => {
                setshowsearch(!showsearch)
                console.log(showsearch)
              }}>
                <MagnifyingGlassIcon className="w-6 h-6"/>
              </button>
            </div>
          </div>
          {showsearch && 
            <form className="mt-4 px-2 flex flex-1" onSubmit={(e) => {handlesubmit(e)}}>
              <input
                type="search"
                id="searchbox"
                placeholder="作品を検索する"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-sky-500 w-[32rem] focus:ring-sky-500 focus:border-4 px-3 py-2.5"
              ></input>
            </form>
          }
          <form className="hidden md:flex flex-1" onSubmit={(e) => {handlesubmit(e)}}>
            <input
              type="search"
              id="searchbox"
              placeholder="作品を検索する"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-sky-500 w-[32rem] focus:ring-sky-500 focus:border-4 px-3 py-2.5"
            ></input>
          </form>
          {ctx.UserInfo === false || ctx.UserInfo === null ? (
            <div className="flex-1">
              <div className="hidden md:flex justify-end items-center">
                <Link href="/signin">
                  <a className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                    サインイン
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-600">
                    サインアップ
                  </a>
                </Link>
              </div>
              <div className="items-center justify-end md:hidden">
                <div onClick={() => {setShowSidebar(false)}}>
                  <Sidebar isOpen={showSidebar} avatar={null} name={null} id={null} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="md:hidden">
                <div onClick={() => {setShowSidebar(false)}}>
                  <Sidebar isOpen={showSidebar} avatar={ctx.UserInfo["avatar_url"]} name={ctx.UserInfo.name} id={ctx.UserInfo.uid} />
                </div>
              </div>
              <div className="hidden md:flex justify-end items-center">
                <Link href="/upload">
                  <a className="mr-8 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-sky-500 px-6 py-2 text-base font-bold text-white shadow-sm hover:bg-sky-600">
                    作品を投稿
                  </a>
                </Link>
                <Dropdown avatar={ctx.UserInfo["avatar_url"]} id={ctx.UserInfo.uid}></Dropdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
