import Link from "next/link";
import React, { useContext, useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Header from "../components/header/header";
import { userInfoContext } from "../context/userInfoContext";
import { useUser } from "@supabase/auth-helpers-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Settings = () => {
    const ctx = useContext(userInfoContext);
    const {user, error} = useUser()
    console.log(user)
    return (
        <div>
        <Header></Header>
        <div className="mx-auto px-3 sm:px-6 lg:max-w-7xl lg:px-7 w-full h-full">
            <div className="p-4 w-full bg-gray-50 bg-white rounded-lg border border-gray-300 sm:p-8">
                <h5 className="mb-2 text-xl font-bold text-gray-900">アカウント</h5>
                <p className="mb-5 text-gray-500 sm:text-base">アカウントについての情報を確認したり、変更したりします。</p>
                <div>
                    <div className="mt-6">
                        <div className="block mb-2 text-base font-medium text-gray-900">
                            ユーザーID
                        </div>
                        <p
                            className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full"
                        >@{ctx.UserInfo["uid"]}</p>
                        {/* <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
                            required
                            spellCheck="false"
                        ></input> */}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="mt-6">
                        <div className="block mb-2 text-base font-medium text-gray-900">
                            メールアドレス
                        </div>
                        <p
                            className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full"
                        >{`********@{user["email"].split("@")[1]}`}</p>
                        {/* <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
                            required
                            spellCheck="false"
                        ></input> */}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="mt-6">
                        <div className="block mb-2 text-base font-medium text-gray-900">
                            パスワード
                        </div>
                        <p
                            className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full"
                        >********</p>
                        {/* <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
                            required
                            spellCheck="false"
                        ></input> */}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="block mb-2 text-base font-medium text-gray-900">
                        閲覧制限
                    </div>
                    <div className="flex items-center">
                        <p className="font-semibold block text-sm text-gray-900">
                            閲覧制限作品(R-18)
                        </p>
                        <div className="ml-4 flex items-center">
                            <input disabled type="radio" value="" name="r18-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">表示する</label>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input disabled checked type="radio" value="" name="r18-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">表示しない</label>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <p className="font-semibold block text-sm text-gray-900">
                            グロテスクな作品（R-18G）
                        </p>
                        <div className="ml-4 flex items-center">
                            <input disabled type="radio" value="" name="r18g-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">表示する</label>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input disabled checked type="radio" value="" name="r18g-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                            <label className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">表示しない</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 w-full bg-gray-50 bg-white rounded-lg border border-gray-300 sm:p-8 my-8">
                <h5 className="mb-2 text-xl font-bold text-gray-900">プロフィール</h5>
                <p className="mb-5 text-gray-500 sm:text-base">プロフィールを確認したり、変更したりします。</p>
                <div>
                    <div>
                        <div className="block mb-2 text-base font-medium text-gray-900">
                            ニックネーム
                        </div>
                        <p
                            className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full"
                        >Fくん！</p>
                        {/* <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
                            required
                            spellCheck="false"
                        ></input> */}
                    </div>
                    </div>
                    <div className="mt-6">
                        <div className="bold block mb-2 text-base font-medium text-gray-900">
                            自己紹介
                        </div>
                        <p
                            className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full"
                        >どこかのFくん。このサイトの開発者。</p>
                        {/* <textarea 
                            className="block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-32 w-full p-2.5 resize-none"
                            id="prompt"
                            required
                            spellCheck="false"
                        ></textarea> */}
                    </div>
            </div>        
        </div>
        </div>
    );
};

export default Settings;
