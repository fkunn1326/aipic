import { GetServerSideProps } from "next";
import React from "react";
import Head from "next/head";
import { t } from "../utils/Translation"


export const getServerSideProps = async ({ res, locale }) => {
  res.statusCode = 503;
  return { props: {
  }};
};

const Maintenance = (...props) => {

  return (
    <>
      <Head>
        <title>{t('MaintenancePage.Title',"AIPIC メンテナンス中")}</title>
      </Head>
      <div>
        <>
          <main className="dark:text-white flex flex-col gap-y-2 items-center justify-center w-screen h-screen">
            <p>
              {t('MaintenancePage.Body1',"AIPICはただいまメンテナンス中です。")}
              <br />
            </p>
            <p>
              {t('MaintenancePage.Body2',"ご利用の皆様にはご迷惑をおかけし、大変申し訳ありません。")}
              <br />
            </p>
            <p>
              {t('MaintenancePage.Body3',"メンテナンス終了までしばらくお待ち下さい。")}
              <br />
            </p>
          </main>
        </>
      </div>
    </>
  )
};

export default Maintenance;
