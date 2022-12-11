import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { supabaseClient } from "../utils/supabaseClient";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { userInfoContext } from "../context/userInfoContext";
import axios from "axios";
import { useRouter } from "next/router";
import { HiOutlineUserCircle, HiOutlineCog6Tooth } from "react-icons/hi2"
import SettingModal from "../components/modal/settingmodal"
import toast, { Toaster } from 'react-hot-toast';
import ReactCrop, { makeAspectCrop, centerCrop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from '../utils/canvasPreview'
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const getServerSideProps = async ({ req, res, locale }) => {
  const supabase = createServerSupabaseClient({ req, res })
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
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
      initialSession: session,
      user: session.user,
    },
  }
}

const idregex = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\s+\[\\\]^_`{|}~]/g;

const Settings = ({ initialSession, user }, ...props) => {
  const { t } = useTranslation('common')

  const ctx = useContext(userInfoContext);
  
  const [states, setstates] = useState({
    userid: "",
    email: "",
    password: "********",
    access_limit: {
      r18: false,
      r18g: false,
    },
    name: "",
    introduce: "",
    avatar_url: "",
    header_url: ""
  });
  const [ischanged, setischanged] = useState(false);
  const [idstate, setidstate] = useState(0);
  const [invalid, setinvalid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarOpen, setisAvatarOpen] = useState(false);
  const [isHeaderOpen, setisHeaderOpen] = useState(false);
  const [selected, setSelected] = useState("")
  const [selectedtitle, setSelectedTitle] = useState("")
  const [multi, setMulti] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState("")
  const [headerSrc, setHeaderSrc] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)
  const inputHRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const completedRef = useRef<any>(null)

  const handleClose = () => {
    setIsOpen(false);
    setisAvatarOpen(false);
    setisHeaderOpen(false);
  }

  const router = useRouter();

  const handleedit = async (key: string, value: string) => {
    const localObj = Object.assign(states)
    localObj[key] = value
    setstates(localObj)
    const obj = {"id": user?.id};
    obj[key] = value;
    const { data, error } =  await supabaseClient.from("profiles").update(obj)
  };


  useEffect(() => {
    if (user && ctx.UserInfo) {
      setstates({
        ...states,
        userid: ctx.UserInfo?.uid,
        email: user?.email!,
        access_limit: ctx.UserInfo?.access_limit,
        name: ctx.UserInfo?.name,
        introduce: ctx.UserInfo?.introduce,
        avatar_url: ctx.UserInfo?.avatar_url,
        header_url: ctx.UserInfo?.header_url,
      });
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
        <h1 className="text-lg font-semibold">
          {t('SettingsPage.Modal.Edit',"{{title}}を編集する", { title: selectedtitle })}
        </h1>
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
            }}>{t('SettingsPage.Cancel',"キャンセル")}</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              handleedit(selected, value)
              setIsOpen(false)
            }}>{t('SettingsPage.Confirm',"変更する")}</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const AvatarModal = ({ isOpen, onClose, src }) => {
    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">
        {t('SettingsPage.Modal.Edit',"{{title}}を編集する", { title: selectedtitle })}
        </h1>
        <AvatarCrop src={src} />
        <canvas
            ref={canvasRef}
            className="hidden"
        />
        <p className="text-sm font-medium text-gray-500">{t('SettingsPage.note',"※ 反映には少し時間がかかります。")}</p>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setisAvatarOpen(false)
            }}>{t('SettingsPage.Cancel',"キャンセル")}</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              //@ts-ignore
              canvasPreview(imgRef.current, canvasRef.current, completedRef.current, 1, 0)
              canvasRef.current?.toBlob(async function(blob) {
                const responseUploadURL = await axios.post("/api/r2/upload");
                const url = JSON.parse(JSON.stringify(responseUploadURL.data));
                var formdata = new FormData();
                formdata.append("file", blob as Blob);
                formdata.append("id", `avatar-${user?.id}`);
                await axios.post(url.uploadURL, formdata, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                handleedit(selected, `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/avatar-${user?.id}/public`)
              })
              setisAvatarOpen(false)
            }}>{t('SettingsPage.Confirm',"変更する")}</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const AvatarCrop = ({ src }) => {
    const [crop, setCrop] = useState<any>({
      unit: '%',
      x: 0,
      y: 0,
      width: 75,
      height: 75
    })
    const [completedCrop, setCompletedCrop] = useState<any>()

    function onImageLoad(e) {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          1,
          width,
          height
        ),
        width,
        height
      )
      setCrop(crop)
    }
    return (
      <ReactCrop
        crop={crop}
        onChange={(c) => {
          setCrop(c)
        }}
        onComplete={(c) => {
          setCompletedCrop(c)
          completedRef.current = c
        }}
        aspect={1}
        minHeight={1}
        minWidth={1}
        className="rounded mt-4"
        circularCrop
        ruleOfThirds
      >
        <img src={src} onLoad={onImageLoad} ref={imgRef}  />
      </ReactCrop>
    )
  }

  const HeaderModal = ({ isOpen, onClose, src }) => {
    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">{t('SettingsPage.Modal.Edit',"{{title}}を編集する", { title: selectedtitle })}</h1>
        <HeaderCrop src={src} />
        <canvas
            ref={canvasRef}
            className="hidden"
        />
        <p className="text-sm font-medium text-gray-500">{t('SettingsPage.note',"※ 反映には少し時間がかかります。")}</p>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setisHeaderOpen(false)
            }}>{t('SettingsPage.Cancel',"キャンセル")}</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              //@ts-ignore
              canvasPreview(imgRef.current, canvasRef.current, completedRef.current, 1, 0)
              canvasRef.current?.toBlob(async function(blob) {
                const responseUploadURL = await axios.post("/api/r2/upload");
                const url = JSON.parse(JSON.stringify(responseUploadURL.data));
                var formdata = new FormData();
                formdata.append("file", blob as Blob);
                formdata.append("id", `header-${user?.id}`);
                await axios.post(url.uploadURL, formdata, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                handleedit(selected, `https://imagedelivery.net/oqP_jIfD1r6XgWjKoMC2Lg/header-${user?.id}/public`)
              })
              setisHeaderOpen(false)
            }}>{t('SettingsPage.Confirm',"変更する")}</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const HeaderCrop = ({ src }) => {
    const [crop, setCrop] = useState<any>({
      unit: '%',
      x: 0,
      y: 0,
      width: 75,
      height: 75
    })

    const [completedCrop, setCompletedCrop] = useState<any>()

    function onImageLoad(e) {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          2/1,
          width,
          height
        ),
        width,
        height
      )
      setCrop(crop)
    }
    return (
      <ReactCrop
        crop={crop}
        onChange={(c) => {
          setCrop(c)
        }}
        onComplete={(c) => {
          setCompletedCrop(c)
          completedRef.current = c
        }}
        aspect={2/1}
        minHeight={1}
        minWidth={1}
        className="rounded mt-4"
        ruleOfThirds
      >
        <img src={src} onLoad={onImageLoad} ref={imgRef}  />
      </ReactCrop>
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
                <a className="bg-gray-100 dark:bg-slate-800 group rounded-md px-3 py-2.5 flex items-center gap-x-2 text-sm font-medium text-sky-700 dark:text-sky-500">
                  <HiOutlineUserCircle className="h-6 w-6 text-gray-400 stroke-2" />
                  {t('SettingsPage.Profile',"プロフィール")}
                </a>
              </Link>
              <Link href="/settings/account">
                <a className="group rounded-md px-3 py-2.5 flex items-center gap-x-2 text-sm dark:text-white">
                  <HiOutlineCog6Tooth className="h-6 w-6 text-gray-400 stroke-2" />
                  {t('SettingsPage.Account',"アカウント")}
                </a>
              </Link>
            </div>
          </aside>
          <div className="lg:col-span-9 w-full h-fit shadow-md dark:bg-slate-800 rounded-lg border dark:border-slate-600 p-6 sm:p-12">
            <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {t('SettingsPage.Profile',"プロフィール")}
            </h5>
            <p className="mb-5 text-gray-500 dark:text-slate-300 sm:text-base">
              {t('SettingsPage.Profile_Note',"他の人に表示される情報を確認したり、変更したりします。")}
            </p>
            <div className="divide-y divide-gray-200 dark:divide-slate-600 flex flex-col">
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingsPage.NickName',"ニックネーム")}</p>
                <p className="dark:text-slate-200">{states["name"]}</p>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle(t('SettingsPage.NickName',"ニックネーム"))
                  setSelected("name")
                  setMulti(false)
                  setIsOpen(true)
                }}>
                  {t('SettingsPage.Edit',"編集する")}
                </button>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingsPage.Introduce',"自己紹介")}</p>
                <pre className="font-sans whitespace-pre-wrap dark:text-slate-200">{states["introduce"]}</pre>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle(t('SettingsPage.Introduce',"自己紹介"))
                  setSelected("introduce")
                  setMulti(true)
                  setIsOpen(true)
                }}>                  
                  {t('SettingsPage.Edit',"編集する")}
                </button>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingsPage.AvatarImage',"アバター画像")}</p>
                <img className="object-cover rounded-full w-12 h-12" src={states["avatar_url"]}>
                </img>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  inputRef.current?.click()
                  setSelectedTitle(t('SettingsPage.AvatarImage',"アバター画像"))
                  setSelected("avatar_url")
                }}>
                  {t('SettingsPage.Edit',"編集する")}
                </button>
                <input type="file" className="hidden" accept="image/*" ref={inputRef} onChange={(e) => {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    setAvatarSrc(e.target?.result as string)
                    setisAvatarOpen(true)
                  }
                  if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
                }} />
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingsPage.HeaderImage',"ヘッダー画像")}</p>
                <img className="object-cover w-40 h-20" src={states["header_url"]}>
                </img>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  inputHRef.current?.click()
                  setSelectedTitle(t('SettingsPage.HeaderImage',"ヘッダー画像"))
                  setSelected("header_url")
                }}>
                  {t('SettingsPage.Edit',"編集する")}
                </button>
                <input type="file" className="hidden" accept="image/*" ref={inputHRef} onChange={(e) => {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    setHeaderSrc(e.target?.result as string)
                    setisHeaderOpen(true)
                  }
                  
                  if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
                }} />
              </div>
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={handleClose} />
          <AvatarModal isOpen={isAvatarOpen} onClose={handleClose} src={avatarSrc} />
          <HeaderModal isOpen={isHeaderOpen} onClose={handleClose} src={headerSrc} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
