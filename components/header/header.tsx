import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Dropdown from "./dropdown";
import Sidebar from "./sidebar";
import { userInfoContext } from "../../context/userInfoContext";
import {
  Bars3Icon
} from "@heroicons/react/24/solid";
import Sideblur from "./sideblur"

const Header = () => {
  const ctx = useContext(userInfoContext);

  const [update, setUpdate] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div
      className="relative bg-white border"
      onLoad={() => setUpdate(update ? false : true)}
    >
      <div onClick={() => {setShowSidebar(!showSidebar)}} className={`${!showSidebar && "pointer-events-none"}`}>
        <Sideblur isOpen={showSidebar} />
      </div>
      <div className="mx-auto px-8 max-w-xl mb:px-0 sm:max-w-7xl">
        <div className="flex items-center justify-between py-3 md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <p className="cursor-pointer text-2xl">AI Arts</p>
            </Link>
          </div>
          {ctx.UserInfo === false || ctx.UserInfo === null ? (
            <div>
              <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
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
                <button onClick={() => {setShowSidebar(!showSidebar)}}>
                  <Bars3Icon className="w-8 h-8 "/>
                </button>
                <div onClick={() => {setShowSidebar(false)}}>
                  <Sidebar isOpen={showSidebar} avatar={null} name={null} id={null} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="md:hidden">
                <button onClick={() => {setShowSidebar(!showSidebar)}}>
                  <Bars3Icon className="w-8 h-8 "/>
                </button>
                <div onClick={() => {setShowSidebar(false)}}>
                  <Sidebar isOpen={showSidebar} avatar={ctx.UserInfo["avatar_url"]} name={ctx.UserInfo.name} id={ctx.UserInfo.uid} />
                </div>
              </div>
              <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
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
