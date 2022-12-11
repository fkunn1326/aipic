import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { supabaseClient } from "../../utils/supabaseClient";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import { useRouter } from "next/router";
import { HiOutlineUserCircle, HiOutlineCog6Tooth } from "react-icons/hi2"
import SettingModal from "../../components/modal/settingmodal";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps = async ({ req, res, locale }) => {
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
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
      initialSession: session,
      user: session.user,
    },
  }
}

const Settings = ({ initialSession, user }, ...props) => {
  const { t } = useTranslation('common')
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
      if (error.message.startsWith("duplicate key value violates unique constraint")){
        localObj[key] = ctx.UserInfo?.[selected]
        setstates(localObj)
        toast.error(t('SettingsPage.Account_Error1',"そのIDは既に使用されています"))
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
        <h1 className="text-lg font-semibold">{t('SettingsPage.Modal.Edit',"{{title}}を編集する", { title: selectedtitle })}</h1>
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
            }}>{t('SettingsPage.Confirm',"変更する")}</button>
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
        <h1 className="text-lg font-semibold">{t('SettingsPage.Modal.Edit',"{{title}}を編集する", { title: selectedtitle })}</h1>
        <div className="mt-6 grid grid-cols-3 items-center gap-x-3">
          <p className="font-medium">R18</p>
          <div className="flex w-max gap-x-3">
            <div className="flex items-center gap-x-1">
              <input type="radio" name="r18" id="r18ok" value="表示する" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={states[selected]?.r18} ref={r18Ref} />
              <label htmlFor="r18ok" className="cursor-pointer">{t('SettingPage.Show','表示する')}</label>
            </div>
            <div className="flex items-center gap-x-1">
            <input type="radio" name="r18" id="r18no" value="表示しない" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={!states[selected]?.r18} />
              <label htmlFor="r18no" className="cursor-pointer">{t('SettingPage.Unshow','表示しない')}</label>
            </div>
          </div>
        </div>
        <div className="my-1 grid grid-cols-3 items-center gap-x-3">
          <p className="font-medium">R18G</p>
          <div className="flex w-max gap-x-3">
            <div className="flex items-center gap-x-1">
              <input type="radio" name="r18g" id="r18gok" value="表示する" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={states[selected]?.r18g} ref={r18gRef} />
              <label htmlFor="r18gok" className="cursor-pointer">{t('SettingPage.Show','表示する')}</label>
            </div>
            <div className="flex items-center gap-x-1">
            <input type="radio" name="r18g" id="r18gno" value="表示しない" className="appearance-none	rounded-full h-4 w-4 border-4 border-gray-300 bg-white checked:bg-white checked:border-sky-500 focus:outline-none transition duration-200 cursor-pointer shadow" defaultChecked={!states[selected]?.r18g}  />
              <label htmlFor="r18gno" className="cursor-pointer">{t('SettingPage.Unshow','表示しない')}</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setIsAcOpen(false)
            }}>{t('SettingsPage.Cancel',"キャンセル")}</button>
            <button type="button" className="px-3 py-1.5 bg-sky-500 shadow rounded-lg text-white text-sm font-medium"  onClick={() => {
              handleedit(selected, {
                "r18": r18Ref.current?.checked,
                "r18g": r18gRef.current?.checked
              })
            }}>{t('SettingsPage.Confirm',"変更する")}</button>
          </div>
        </div>
      </SettingModal>
    )
  }

  const DlModal = ({ isOpen, onClose }) => {
    const [value, setValue] = useState(states[selected])

    return (
      <SettingModal isOpen={isOpen} onClose={() => onClose()}>
        <h1 className="text-lg font-semibold">{t('SettingPage.DeleteModal.Title','本当に削除しますか？')}</h1>
        <p className="mt-2 text-sm ">{t('SettingPage.DeleteModal.Body','一度アカウントを削除すると、アカウントに関連する情報がすべて削除されます。')}</p>
        <div className="flex justify-end">
          <div className="flex flex-row mt-4 gap-x-3">
            <button type="button" className="px-3 py-1.5 border dark:border-none dark:bg-slate-800 shadow rounded-lg text-sm" onClick={() => {
              setIsDlOpen(false)
            }}>{t('SettingsPage.Cancel',"キャンセル")}</button>
            <button type="button" className="px-3 py-1.5 bg-red-500 shadow rounded-lg text-white text-sm font-medium"  onClick={async () => {
              supabaseClient.auth.signOut();
              await fetch(
                "/api/account/delete",
                {
                  method: "post"
                }
              );
              setIsDlOpen(false)
              router.push("/");
            }}>{t('SettingPage.Delete','削除する')}</button>
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
                  {t('SettingPage.Profile','プロフィール')}
                </a>
              </Link>
              <Link href="/settings">
                <a className="bg-gray-100 dark:bg-slate-800 group rounded-md px-3 py-2.5 flex items-center gap-x-2 text-sm font-medium text-sky-700 dark:text-sky-500">
                  <HiOutlineCog6Tooth className="h-6 w-6 text-gray-400 stroke-2" />
                  {t('SettingPage.Account','アカウント')}
                </a>
              </Link>
            </div>
          </aside>
          <div className="lg:col-span-9 w-full h-fit shadow-md dark:bg-slate-800 rounded-lg border dark:border-slate-600 p-6 sm:p-12">
            <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {t('SettingPage.Account','アカウント')}
            </h5>
            <p className="mb-5 text-gray-500 dark:text-slate-300 sm:text-base">
              {t('SettingPage.Account_Description','アカウントについての情報を確認したり、変更したりします。')}
            </p>
            <div className="divide-y divide-gray-200 dark:divide-slate-600 flex flex-col">
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingPage.UserId','ユーザーID')}</p>
                <p className="dark:text-slate-200">{states["uid"]}</p>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle(t('SettingPage.UserId',"ユーザーID"))
                  setSelected("uid")
                  setMulti(false)
                  setIsOpen(true)
                }}>
                  {t('SettingPage.Edit','編集する')}
                </button>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingPage.Email','メールアドレス')}</p>
                <p className="dark:text-slate-200">{states["email"]}</p>
              </div>
              <div className="py-5 grid grid-cols-3">
                <p className="font-medium dark:text-white">{t('SettingPage.AccessLimit','閲覧制限')}</p>
                <div className="flex flex-col sm:flex-row gap-x-4 dark:text-slate-200">
                  <div className="flex flex-row gap-x-2">
                    <p className="font-medium">R18:</p>
                    <p>{states["access_limit"]["r18"] ? t('SettingPage.Show',"表示する") : t('SettingPage.Unshow',"表示しない")}</p>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <p className="font-medium">R18G:</p>
                    <p className="whitespace-nowrap">{states["access_limit"]["r18g"] ? t('SettingPage.Show',"表示する") : t('SettingPage.Unshow',"表示しない")}</p>
                  </div>
                </div>
                <button className="flex justify-end text-sky-600 text-sm" onClick={() => {
                  setSelectedTitle("閲覧制限")
                  setSelected("access_limit")
                  setMulti(false)
                  setIsAcOpen(true)
                }}>
                  {t('SettingPage.Edit','編集する')}
                </button>
              </div>
              <div className="py-5 flex flex-row justify-between">
                <div className="flex flex-row gap-x-12 text-base text-gray-600 dark:text-white">
                  <p className="font-medium">{t('SettingPage.DeleteAccount','アカウント削除')}</p>
                </div>
                <button className="flex justify-end text-red-600 text-sm" onClick={() => {
                  setSelectedTitle("削除")
                  setSelected("delete")
                  setMulti(false)
                  setIsDlOpen(true)
                }}>                  
                  {t('SettingPage.Delete','削除する')}
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