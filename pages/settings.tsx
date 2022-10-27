import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import Header from "../components/header/header";
import { userInfoContext } from "../context/userInfoContext";
import { useUser } from "@supabase/auth-helpers-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const getServerSideProps = withPageAuth({ redirectTo: "/" });

const idregex = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\s+\[\\\]^_`{|}~]/g;

const Settings = () => {
  const ctx = useContext(userInfoContext);
  const { user, error } = useUser();
  const [states, setstates] = useState({
    userid: "",
    email: "",
    password: "********",
    access_limit: {
      r18: false,
      r18g: false,
    },
  });
  const [ischanged, setischanged] = useState(false);
  const [idstate, setidstate] = useState(0);

  const handleedit = (key, value) => {
    setstates({ ...states, [key]: states[value] });
  };

  const handleidchange = (e) => {
    var peer1 = document.getElementById("id_peer1") as HTMLElement;
    var peer2 = document.getElementById("id_peer2") as HTMLElement;
    var peer3 = document.getElementById("id_peer3") as HTMLElement;
    setstates({ ...states, userid: e.target.value });
    setischanged(true);
    (async () => {
      var { data } = (await supabaseClient
        .from("profiles")
        .select("id, uid")) as any;
      data = data.find((profile) => profile.uid === e.target.value);
      peer1.classList.add("hidden");
      peer2.classList.add("hidden");
      peer3.classList.add("hidden");
      if (e.target.value !== "") {
        if (data === undefined) {
          if (idregex.test(e.target.value)) {
            peer3.classList.remove("hidden");
          }
        } else {
          if (data["id"] === user!["id"]) {
          } else {
            peer1.classList.remove("hidden");
          }
        }
      } else {
        peer2.classList.remove("hidden");
      }
    })();
  };

  const handleaccesschange = (obj) => {
    setischanged(true);
    setstates({ ...states, access_limit: obj });
  };

  const handlecancel = (e) => {
    setstates({
      ...states,
      userid: ctx["UserInfo"]["uid"],
      email: user!["email"]!,
      access_limit: ctx["UserInfo"]["access_limit"],
    });
    setischanged(false);
  };

  const handleconfirm = async (e) => {
    if (states["userid"] !== undefined) {
      if (!idregex.test(states["userid"])) {
        var new_obj = Object.assign(ctx["UserInfo"]);
        new_obj["uid"] = states["userid"];
        new_obj["access_limit"] = states["access_limit"];
        await supabaseClient.from("profiles").upsert(new_obj).select();
        setischanged(false);
      }
    }
  };

  const isdataloaded = useRef(false);

  useEffect(() => {
    if (!isdataloaded.current) {
      if (
        user !== null &&
        ctx !== false &&
        ctx["UserInfo"]["access_limit"] !== undefined &&
        ctx["UserInfo"]["uid"] !== undefined
      ) {
        setstates({
          ...states,
          userid: ctx["UserInfo"]["uid"],
          email: user!["email"]!,
          access_limit: ctx["UserInfo"]["access_limit"],
        });
        isdataloaded.current = true;
      }
    }
  }, [user, ctx]);

  return (
    <div>
      <Header></Header>
      <div className="mx-auto px-3 sm:px-6 lg:max-w-7xl lg:px-7 w-full h-full">
        <div className="p-4 w-full bg-gray-50 rounded-lg border border-gray-300 sm:p-8 my-8">
          <h5 className="mb-2 text-xl font-bold text-gray-900">アカウント</h5>
          <p className="mb-5 text-gray-500 sm:text-base">
            アカウントについての情報を確認したり、変更したりします。
          </p>
          <div>
            <div className="mt-6">
              <div className="block text-base font-medium text-gray-900 mb-2">
                ユーザーID
              </div>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
                  @
                </span>
                <input
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-r-lg focus:ring-sky-600 focus:border-sky-600 block w-1/2 p-2.5"
                  required
                  value={states["userid"]}
                  onChange={(e) => {
                    handleidchange(e);
                  }}
                  spellCheck="false"
                ></input>
              </div>
              <p id="id_peer1" className="mt-2 hidden text-red-500 text-sm">
                このIDは既に使用されています。
              </p>
              <p id="id_peer2" className="mt-2 hidden text-red-500 text-sm">
                空欄にすることはできません。
              </p>
              <p id="id_peer3" className="mt-2 hidden text-red-500 text-sm">
                IDに空白や記号を含めることはできません。
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mt-6">
              <div className="flex items-center mb-2">
                <div className="block text-base font-medium text-gray-900">
                  現在のメールアドレス
                </div>
                <button className="ml-2 block text-sm font-medium text-sky-600">
                  変更する
                </button>
                <button className="ml-2 block text-sm font-medium text-sky-600">
                  パスワードを変更する
                </button>
              </div>
              <input
                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-1/2 p-2.5"
                required
                value={states["email"]}
                readOnly
                spellCheck="false"
              ></input>
            </div>
          </div>
          <div className="mt-6">
            <div className="block text-base font-medium text-gray-900 mb-3">
              閲覧制限
            </div>
            <div className="flex items-center">
              <p className="font-semibold block text-sm text-gray-900">
                閲覧制限作品(R-18)
              </p>
              <div className="ml-4 flex items-center">
                <label className="ml-2 text-sm font-medium text-gray-900">
                  <input
                    checked={states["access_limit"]["r18"]}
                    type="radio"
                    name="r18-radio"
                    onChange={(e) => {
                      var new_obj = Object.assign({}, states["access_limit"]);
                      new_obj["r18"] = !new_obj["r18"];
                      handleaccesschange(new_obj);
                    }}
                    className="mr-2 outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  ></input>
                  表示する
                </label>
              </div>
              <div className="ml-4 flex items-center">
                <label className="ml-2 text-sm font-medium text-gray-900">
                  <input
                    checked={!states["access_limit"]["r18"]}
                    type="radio"
                    value=""
                    name="r18-radio"
                    onChange={(e) => {
                      var new_obj = Object.assign({}, states["access_limit"]);
                      new_obj["r18"] = !new_obj["r18"];
                      handleaccesschange(new_obj);
                    }}
                    className="mr-2 outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  ></input>
                  表示しない
                </label>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <p className="font-semibold block text-sm text-gray-900">
                グロテスクな作品（R-18G）
              </p>
              <div className="ml-4 flex items-center">
                <label className="ml-2 text-sm font-medium text-gray-900">
                  <input
                    checked={states["access_limit"]["r18g"]}
                    type="radio"
                    onChange={(e) => {
                      var new_obj = Object.assign({}, states["access_limit"]);
                      new_obj["r18g"] = !new_obj["r18g"];
                      handleaccesschange(new_obj);
                    }}
                    name="r18g-radio"
                    className="mr-2 outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  ></input>
                  表示する
                </label>
              </div>
              <div className="ml-4 flex items-center">
                <label className="text-sm font-medium text-gray-900">
                  <input
                    checked={!states["access_limit"]["r18g"]}
                    type="radio"
                    onChange={(e) => {
                      var new_obj = Object.assign({}, states["access_limit"]);
                      new_obj["r18g"] = !new_obj["r18g"];
                      handleaccesschange(new_obj);
                    }}
                    name="r18g-radio"
                    id="r18g-ratio-d"
                    className="mr-2 outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  ></input>
                  表示しない
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <button
              type="button"
              disabled={!ischanged}
              onClick={(e) => {
                handleconfirm(e);
              }}
              className="font-medium mt-2 rounded-lg text-sm px-3 py-1.5 text-center text-white bg-sky-500 disabled:bg-sky-300 disabled:cursor-no-drop"
            >
              変更を保存する
            </button>
            <button
              type="button"
              disabled={!ischanged}
              onClick={(e) => handlecancel(e)}
              className="ml-2 font-medium mt-2 rounded-lg text-sm px-3 py-1.5 text-center border border-sky-500 text-sky-500 hover:text-white hover:bg-sky-500 disabled:text-sky-300 disabled:bg-white disabled:cursor-no-drop"
            >
              キャンセル
            </button>
          </div>
          <div className="mt-12">
            <div className="mt-6">
              <div className="block text-base font-medium text-gray-900 mb-3">
                アカウントの削除
              </div>
              <p className="text-gray-900 sm:text-sm rounded-lg font-semibold block w-full">
                アカウントを削除すると、二度と復元ができなくなります。
              </p>
              <button
                type="button"
                className="text-red-600 font-medium mt-2 rounded-lg text-sm px-3 py-1.5 text-center border border-red-600 hover:text-white hover:bg-red-500"
              >
                アカウントを削除する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
