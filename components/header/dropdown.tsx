import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  UserCircleIcon,
  ListBulletIcon,
  HeartIcon,
  Cog6ToothIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { supabaseClient } from "../../utils/supabaseClient";
import Router, { useRouter } from "next/router";
import React from "react";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdawn(props) {
<<<<<<< HEAD
  const t = ( key, str, object: any=undefined ) => {
    return str
  }
=======
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)
  const router = useRouter();
  var avatar = props.avatar;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="outline-none w-max items-center inline-flex justify-center rounded-md bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-gray-700 ring-white">
          <img src={avatar} className="h-12 w-12 rounded-full"></img>
          <ChevronDownIcon
            className="-mr-1 ml-2 h-5 w-5 dark:text-slate-400"
            aria-hidden="true"
          />
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
              <Link href={`/users/${props.id}`}>
                <a className="text-sm cursor-pointer flex flex-row px-4 py-2 items-center dark:text-slate-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-slate-900 hover:dark:text-slate-200">
                  <UserCircleIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <p className="block text-sm cursor-pointer">
                    マイページ
                  </p>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/dashboard">
                <a className="text-sm cursor-pointer flex flex-row px-4 py-2 items-center dark:text-slate-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-slate-900 hover:dark:text-slate-200">
                  <ListBulletIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <p className="block text-sm cursor-pointer">
                    ダッシュボード
                  </p>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/likes">
                <a className="text-sm cursor-pointer flex flex-row px-4 py-2 items-center dark:text-slate-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-slate-900 hover:dark:text-slate-200">
                  <HeartIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <p className="block text-sm cursor-pointer">
                    いいね一覧
                  </p>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/settings">
                <a className="text-sm cursor-pointer flex flex-row px-4 py-2 items-center dark:text-slate-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-slate-900 hover:dark:text-slate-200">
                  <Cog6ToothIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <p className="block text-sm cursor-pointer">
                    設定
                  </p>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/history">
                <a className="text-sm cursor-pointer flex flex-row px-4 py-2 items-center dark:text-slate-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-slate-900 hover:dark:text-slate-200">
                  <ClockIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                  <p className="block text-sm cursor-pointer">
                    閲覧履歴
                  </p>
                </a>
              </Link>
            </Menu.Item>
            <form method="" action="">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active
                        ? "bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-slate-200"
                        : "dark:text-slate-200 text-gray-700",
                      "text-sm cursor-pointer flex flex-row px-4 py-2 items-center"
                    )}
                  >
                    <ArrowRightOnRectangleIcon className="text-gray-400 w-5 h-5 mr-2 stroke-2" />
                    <button
                      aria-label="サインアウトボタン"
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
