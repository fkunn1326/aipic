import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { supabaseClient } from "../../utils/supabaseClient";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import axios from "axios";
import { useRouter } from "next/router";
import { HiOutlineUserCircle, HiOutlineCog6Tooth } from "react-icons/hi2"
import SettingModal from "../../components/modal/settingmodal";
import toast, { Toaster } from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const getServerSideProps = async (req, res) => {
  const supabase = createServerSupabaseClient(req)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

const idregex = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\s+\[\\\]^_`{|}~]/g;

const Settings = ({initialSession, user}) => {
  const ctx = useContext(userInfoContext);
  
  const [states, setstates] = useState({
    uid: "",
    email: "",
    password: "********",
    access_limit: {
      r18: false,
      r18g: false,
    },
  });
  const [ischanged, setischanged] = useState(false);
  const [idstate, setidstate] = useState(0);
  const [invalid, setinvalid] = useState(false);
  const [selected, setSelected] = useState("")
  const [selectedtitle, setSelectedTitle] = useState("")
  const [multi, setMulti] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isAcOpen, setIsAcOpen] = useState(false);
  const [isDlOpen, setIsDlOpen] = useState(false);

  const router = useRouter();

  const handleedit = async (key: string, value: string | object) => {
    const localObj = Object.assign(states)
    localObj[key] = value
    setstates(localObj)
    const obj = {"id": user?.id};
    obj[key] = value;
    const { data, error } = await supabaseClient.from("profiles").update(obj)
    if (error){
      console.log(error)
      if (error.message.startsWith("duplicate key value violates unique constraint")){
        localObj[key] = ctx.UserInfo?.[selected]
        setstates(localObj)
        toast.error("そのIDは既に使用されています")
      }else{
        toast.error(error.message)
      }
    }else{
      setIsOpen(false)
      setIsAcOpen(false)
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAcOpen(false);
  }

  const handleidchange = (e) => {
    var peer1 = document.getElementById("id_peer1") as HTMLElement;
    var peer2 = document.getElementById("id_peer2") as HTMLElement;
    var peer3 = document.getElementById("id_peer3") as HTMLElement;
    setstates({ ...states, uid: e.target.value });
    setischanged(true);
    (async () => {
      var { data } = (await supabaseClient
        .from("profiles")
        .select("id, uid")) as any;
      data = data.find((profile) => profile.uid === e.target.value);
      peer1.classList.add("hidden");
      peer2.classList.add("hidden");
      peer3.classList.add("hidden");
      setinvalid(false);
      if (e.target.value !== "") {
        if (data === undefined) {
          if (idregex.test(e.target.value)) {
            peer3.classList.remove("hidden");
            setinvalid(true);
          }
        } else {
          if (data["id"] === user!["id"]) {
          } else {
            peer1.classList.remove("hidden");
            setinvalid(true);
          }
        }
      } else {
        peer2.classList.remove("hidden");
        setinvalid(true);
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
      uid: ctx["UserInfo"]["uid"],
      email: user!["email"]!,
      access_limit: ctx["UserInfo"]["access_limit"],
    });
    setischanged(false);
  };

  const handleconfirm = async (e) => {
    if (!invalid) {
      if (states["userid"] !== undefined) {
        if (!idregex.test(states["userid"])) {
          var new_obj = Object.assign(ctx["UserInfo"]);
          new_obj["uid"] = states["userid"];
          new_obj["access_limit"] = states["access_limit"];
          await supabaseClient.from("profiles").upsert(new_obj).select();
          setischanged(false);
        }
      }
    }
  };

  const isdataloaded = useRef(false);

  useEffect(() => {
    if (!isdataloaded.current) {
      if (user && ctx.UserInfo) {
        setstates({
          ...states,
          uid: ctx.UserInfo?.uid,
          email: user?.email!,
          access_limit: ctx.UserInfo?.access_limit,
        });
        isdataloaded.current = true;
      }
    }
  }, [user, ctx]);

  const Modal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(states[selected])

    function calcTextAreaHeight(value){
      let rowsNum = value.split('\n').length;
      return rowsNum
    }

    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">{selectedtitle}を編集する</h1>
        {multi ? 
          <textarea
            value={value}
            rows={calcTextAreaHeight(value)} 
            onChange={(e) => {setValue(e.target.value)}}
            className="mt-4 transition-all duration-200 ease-out w-full p-2 text-sm text-black-700 placeholder-gray-500 rounded-lg border border-gray-300 shadow-sm focus:border-white focus:outline-none dark:bg-black-900 dark:text-white dark:placeholder-gray-400 block focus:ring-2 focus:ring-sky-500 dark:focus:ring-4 dark:bg-slate-700 dark:outline-none dark:border-none"
          />
          :
          <input
            value={value}
            onChange={(e) => {setValue(e.target.value)}}
            className="mt-4 transition-all duration-200 ease-out w-full p-2 text-sm text-black-700 placeholder-gray-500 rounded-lg border border-gray-300 shadow-sm focus:border-white focus:outline-none dark:bg-black-900 dark:text-white dark:placeholder-gray-400 block focus:ring-2 focus:ring-sky-500 dark:focus:ring-4 dark:bg-slate-700 dark:outline-none dark:border-none"
          />  
        }

        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setIsOpen(false)
            }}>キャンセル</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              handleedit(selected, value)
            }}>変更する</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const AcModal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(states[selected])

    const r18Ref = useRef<null | HTMLInputElement>(null)
    const r18gRef = useRef<null | HTMLInputElement>(null)

    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">{selectedtitle}を編集する</h1>
        <div className="mt-6 grid grid-cols-3 items-center gap-x-3">
          <p className="font-medium">R18</p>
          <div className="flex w-max gap-x-3">
            <div className="flex items-center gap-x-1">
              <input type="radio" name="r18" id="r18ok" value="表示する" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={states[selected]?.r18} ref={r18Ref} />
              <label htmlFor="r18ok" className="cursor-pointer">表示する</label>
            </div>
            <div className="flex items-center gap-x-1">
            <input type="radio" name="r18" id="r18no" value="表示しない" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={!states[selected]?.r18} />
              <label htmlFor="r18no" className="cursor-pointer">表示しない</label>
            </div>
          </div>
        </div>
        <div className="my-1 grid grid-cols-3 items-center gap-x-3">
          <p className="font-medium">R18G</p>
          <div className="flex w-max gap-x-3">
            <div className="flex items-center gap-x-1">
              <input type="radio" name="r18g" id="r18gok" value="表示する" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={states[selected]?.r18g} ref={r18gRef} />
              <label htmlFor="r18gok" className="cursor-pointer">表示する</label>
            </div>
            <div className="flex items-center gap-x-1">
            <input type="radio" name="r18g" id="r18gno" value="表示しない" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={!states[selected]?.r18g}  />
              <label htmlFor="r18gno" className="cursor-pointer">表示しない</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setIsAcOpen(false)
            }}>キャンセル</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              handleedit(selected, {
                "r18": r18Ref.current?.checked,
                "r18g": r18gRef.current?.checked
              })
            }}>変更する</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const DlModal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(states[selected])

    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">本当に削除しますか？</h1>
        <p className="mt-2 text-sm ">一度アカウントを削除すると、アカウントに関連する情報がすべて削除されます。</p>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setIsDlOpen(false)
            }}>キャンセル</button>
            <button type="button" className="px-3 py-1.5 bg-red-500 shadow rounded-lg text-white text-sm font-medium"  onClick={async () => {
              supabaseClient.auth.signOut();
              await axios.post(
                "/api/account/delete"
              );
              setIsDlOpen(false)
              router.push("/");
            }}>削除する</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="mx-auto px-6 sm:max-w-full sm:px-6 lg:max-w-7xl lg:px-7 w-full h-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 lg:min-h-[40rem] my-8">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <div className="space-y-1">
              <Link href="/settings">
                <a className="group rounded-md px-3 py-2.5 flex items-center gap-x-2 text-sm dark:text-white">
                  <HiOutlineUserCircle className="h-6 w-6 text-gray-400 stroke-2" />
                  プロフィール
                </a>
              </Link>
              <Link href="/settings">
                <a className="bg-gray-100 dark:bg-slate-800 group rounded-md px-3 py-2.5 flex items-center gap-x-2 text-sm font-medium text-sky-700 dark:text-sky-500">
                  <HiOutlineCog6Tooth className="h-6 w-6 text-gray-400 stroke-2" />
                  アカウント
                </a>
              </Link>
            </div>
          </aside>
          <div className="lg:col-span-9 w-full h-fit shadow-md dark:bg-slate-800 rounded-lg border dark:border-slate-600 p-6 sm:p-12">
            <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              アカウント
            </h5>
            <p className="mb-5 text-gray-500 dark:text-slate-300 sm:text-base">
              アカウントについての情報を確認したり、変更したりします。
            </p>
            <div className="divide-y divide-gray-200 dark:divide-slate-600 flex flex-col">
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">ユーザーID</p>
                <p className="dark:text-slate-200">{states["uid"]}</p>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle("ユーザーID")
                  setSelected("uid")
                  setMulti(false)
                  setIsOpen(true)
                }}>
                  編集する
                </button>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">メールアドレス</p>
                <p className="dark:text-slate-200">{states["email"]}</p>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">閲覧制限</p>
                <div className="flex flex-col sm:flex-row gap-x-4 dark:text-slate-200">
                  <div className="flex flex-row gap-x-2">
                    <p className="font-medium">R18:</p>
                    <p>{states["access_limit"]["r18"] ? "表示する" : "表示しない"}</p>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <p className="font-medium">R18G:</p>
                    <p className="whitespace-nowrap">{states["access_limit"]["r18g"] ? "表示する" : "表示しない"}</p>
                  </div>
                </div>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle("閲覧制限")
                  setSelected("access_limit")
                  setMulti(false)
                  setIsAcOpen(true)
                }}>
                  編集する
                </button>
              </div>
              <div className="py-5 flex flex-row justify-between">
                <div className="flex flex-row gap-x-12 text-base text-gray-600 dark:text-white">
                  <p className="font-medium">アカウント削除</p>
                </div>
                <button className="flex justify-end text-red-600 text-sm" onClick={() => {
                  setSelectedTitle("削除")
                  setSelected("delete")
                  setMulti(false)
                  setIsDlOpen(true)
                }}>                  
                  削除する
                </button>
              </div>
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={handleClose} />
          <AcModal isOpen={isAcOpen} onClose={handleClose} />
          <DlModal isOpen={isDlOpen} onClose={handleClose} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;