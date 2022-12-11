import { supabaseClient } from "../../utils/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from 'next-i18next'

const Sidebar = ({ isOpen, avatar, name, id }) => {
  const router = useRouter();
  const { t } = useTranslation('common')

  return (
    <div
      className={`top-0 left-0 w-[76vw] bg-white dark:bg-slate-900 rounded-r fixed h-full z-40 ease-in-out duration-[400ms] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-y-6 h-full p-10">
        {avatar === null ? (
          <div className="flex flex-col gap-y-4">
            <Link href="/signin">
              <a className="mt-4 text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.Signin','サインイン')}
              </a>
            </Link>
            <Link href="/signup">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.Signup','サインアップ')}
              </a>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            <Link href={`/users/${id}`}>
              <div className="flex flex-row items-center">
                <img src={avatar} className="h-12 w-12 rounded-full"></img>
                <div className="flex flex-col ml-3">
                  <p className="font-semibold dark:text-white">{name}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{`@${id}`}</p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <a className="mt-4 text-gray-600  dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.Home','ホーム')}
              </a>
            </Link>
            <Link href="/upload">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.PostArtwork','作品の投稿')}
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.DashBoard','ダッシュボード')}
              </a>
            </Link>
            <Link href="/likes">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.LikedArtworks','いいねをした作品')}
              </a>
            </Link>
            <Link href="/settings">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.Settings','アカウントの設定')}
              </a>
            </Link>
            <Link href="/history">
              <a className="text-gray-600 dark:text-slate-400 font-semibold p-2">
                {t('Header.SideBar.History','閲覧履歴')}
              </a>
            </Link>
            <Link href="/">
              <a
                className="text-gray-600 dark:text-slate-400 font-semibold p-2"
                onClick={() => {
                  supabaseClient.auth.signOut();
                  router.push("/");
                }}
              >
                {t('Header.SideBar.Signout','サインアウト')}
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
