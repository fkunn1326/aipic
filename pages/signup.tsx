import Link from "next/link";
import React, { useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";
import { SiteName } from "../components/core/const";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ])),
    },
  }
}

const validate = () => {
  const regex = /^(?=.?[a-z])(?=.?\d)(?=.*?[!-/:-@[-`{-~])[!-~]{8,100}$/i;
  regex.test("");
};

const Signup = (...props) => {
  const { t } = useTranslation('common')

  const pswdregex =
    /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,100}$/i;
  const emailregex =
    /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/g;
  const [forms, setForms] = useState({ email: "", password: "" });
  const [ismailsent, setisMailsent] = useState(false);

  const handleEmailChange = (e) => {
    var el = document.getElementById("email_peer2") as HTMLElement;
    el.classList.add("hidden");
    setForms({ ...forms, email: e.target.value });
  }
  const handlePasswordChange = (e) => {
    var el = document.getElementById("email_peer2") as HTMLElement;
    el.classList.add("hidden");
    setForms({ ...forms, password: e.target.value });
  }
  const clickForms = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.auth.signUp(forms);
    if (data!.user!.identities!.length === 0) {
      var el = document.getElementById("email_peer2") as HTMLElement;
      el.classList.remove("hidden");
    } else {
      setisMailsent(true);
    }
  };

  const clickGoogle = async (e) => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth(
      {
        provider: "google",
        options: {
          redirectTo: `${process.env.BASE_URL}/auth`
        }
      }
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 pt-10 pb-10">
      <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link href="/">
          <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            {SiteName}
          </a>
        </Link>
        <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          {!ismailsent ? (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                {t('SignupPage.Signup',"サインアップ")}
              </h1>
              <form className="space-y-2 md:space-y-6" onSubmit={clickForms}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-300">
                    {t('SignupPage.Email',"メール")}
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm rounded-lg focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:border-4 block w-full p-2.5"
                      autoComplete="username"
                      placeholder="name@example.com"
                      onChange={(e) => {
                        var textel = document.getElementById(
                          "email_peer"
                        ) as HTMLElement;
                        var textel2 = document.getElementById(
                          "email_peer2"
                        ) as HTMLElement;
                        textel2.classList.add("hidden");
                        if (!emailregex.test(e.target.value)) {
                          textel.classList.remove("hidden");
                        } else {
                          textel.classList.add("hidden");
                        }
                        handleEmailChange(e);
                      }}
                      required
                    ></input>
                    <p
                      id="email_peer"
                      className="mt-2 hidden text-pink-600 text-sm"
                    >
                      {t('SignupPage.Email_Wraning1',"有効なメールアドレスを入力してください")}
                    </p>
                    <p
                      id="email_peer2"
                      className="mt-2 hidden text-pink-600 text-sm"
                    >
                      {t('SignupPage.Email_Wraning2',"メールアドレスは既に登録されています。")}
                    </p>
                  </label>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium dark:text-slate-300 text-gray-900">
                    {t('SignupPage.Password',"パスワード")}
                    <input
                      type="password"
                      name="password"
                      id="password1"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900  dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm rounded-lg focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:border-4 block w-full p-2.5"
                      autoComplete="new-password"
                      onChange={(e) => {
                        var textel = document.getElementById(
                          "password1_peer"
                        ) as HTMLElement;
                        if (!pswdregex.test(e.target.value)) {
                          textel.classList.remove("hidden");
                        } else {
                          textel.classList.add("hidden");
                        }
                        handlePasswordChange(e);
                      }}
                      required
                    ></input>
                    <p
                      id="password1_peer"
                      className="mt-2 hidden text-pink-600 text-sm"
                    >
                      {t('SignupPage.Password_Wraning1',"パスワードは、半角英字、数字、記号を組み合わせて 8文字以上で入力してください ")}
                    </p>
                  </label>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-300">
                    {t('SignupPage.PasswordforCheck',"パスワード（確認）")}
                    <input
                      type="password"
                      name="password"
                      id="password2"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:text-sm rounded-lg focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:border-4 block w-full p-2.5"
                      autoComplete="new-password"
                      onChange={(e) => {
                        var textel = document.getElementById(
                          "password2_peer"
                        ) as HTMLElement;
                        if (!(forms["password"] === e.target.value)) {
                          textel.classList.remove("hidden");
                        } else {
                          textel.classList.add("hidden");
                        }
                      }}
                      required
                    ></input>
                    <p
                      id="password2_peer"
                      className="mt-2 hidden text-pink-600 text-sm"
                    >
                      {t('SignupPage.PasswordforCheck_Wraning1',"上のパスワードと一致する必要があります。")}
                    </p>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="items-center h-5">
                      <label className="flex text-sm text-gray-500 items-center">
                        <input
                          id="tos"
                          aria-describedby="tos"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                          required
                        ></input>
                        <div
                          className="ml-3 text-sm cursor-pointer dark:text-slate-300"
                          dangerouslySetInnerHTML={{
                            __html: t('SignupPage.AgreeTos', '<a href="/terms/tos" class="text-sm font-medium text-sky-600 hover:underline">利用規約</a>に同意します。')
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {t('SignupPage.CreateAccount',"アカウントを作る")}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-slate-300 text-center">
                  {t('SignupPage.Or',"または")}
                </p>
                <button
                  type="button"
                  className="w-full bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-gray-900 rounded-lg text-sm px-5 py-2.5 text-center flex justify-center"
                  onClick={(e) => clickGoogle(e)}
                >
                  <svg
                    className="text-sm w-5 h-5 mr-2"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_13183_10121)">
                      <path
                        d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                        fill="#3F83F8"
                      ></path>
                      <path
                        d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                        fill="#FBBC04"
                      ></path>
                      <path
                        d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                        fill="#EA4335"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_13183_10121">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0.5)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                  {t('SignUpPage.WithGoogle',"Googleで続行")}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-slate-300">
                  {t('SignUpPage.Note1',"すでにアカウントがありますか？")}
                  <Link href="/signin">
                    <a className="font-medium text-sky-600 hover:underline">
                      {t('SignUpPage.Signin',"サインイン")}
                    </a>
                  </Link>
                </p>
              </form>
            </div>
          ) : (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {t('SignUpPage.EmailSent.Title',"確認メールを送信しました")}
              </h1>
              <p className="text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                {t('SignUpPage.EmailSent.Note1',"ご登録のメールアドレスにURLをお送りしました。")}
                <br />
                {t('SignUpPage.EmailSent.Note2',"記載してあるURLをクリックし、登録を完了してください。")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
