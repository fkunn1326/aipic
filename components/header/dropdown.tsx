import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon, ListBulletIcon, HeartIcon, Cog6ToothIcon, ClockIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Router, { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdawn(props) {
  const router = useRouter();
  var avatar = props.avatar;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="outline-none w-max items-center inline-flex justify-center rounded-md bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 ring-white">
          <img src={avatar} className="h-12 w-12 rounded-full"></img>
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 dark:text-slate-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
          <Menu.Item>
              {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <UserCircleIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <a
                    className={classNames( "block text-sm cursor-pointer")}
                    onClick={() => {
                      router.push(`/users/${props.id}`);
                    }}
                  >
                    マイページ
                  </a>
                </div>
              )}
          </Menu.Item>
          <Menu.Item>
              {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <ListBulletIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <a
                    className={classNames( "block text-sm cursor-pointer")}
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                  >
                    ダッシュボード
                  </a>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <HeartIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <a
                    className={classNames( "block text-sm cursor-pointer")}
                    onClick={() => {
                      router.push("/likes");
                    }}
                  >
                    いいね一覧
                  </a>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <Cog6ToothIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <a
                    className={classNames( "block text-sm cursor-pointer")}
                    onClick={() => {
                      router.push("/settings");
                    }}
                  >
                    アカウントの設定
                  </a>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
            {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <ClockIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <a
                    className={classNames("block text-sm cursor-pointer")}
                    onClick={() => {
                      router.push("/history");
                    }}
                  >
                    閲覧履歴
                  </a>
                </div>  
              )}
            </Menu.Item>
            <form method="" action="">
              <Menu.Item>
                {({ active }) => (
                <div className={classNames(
                  active ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                  "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                )}>
                  <ArrowRightOnRectangleIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <button
                    type="button"
                    className={classNames("block text-sm cursor-pointer")}
                    onClick={() => {
                      supabaseClient.auth.signOut();
                      router.push("/");
                    }}
                  >
                    サインアウト
                  </button>
                </div>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
