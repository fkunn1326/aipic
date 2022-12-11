import { GetServerSideProps } from "next";
import React from "react";
import Head from "next/head";
<<<<<<< HEAD
import { t } from "../utils/Translation"

=======
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res } = context;
  res.statusCode = 503;
<<<<<<< HEAD
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
=======
  return { props: {} };
};

const Maintenance = () => (
  <>
    <Head>
      <title>AIPIC メンテナンス中</title>
    </Head>
    <div>
      <>
        <main className="dark:text-white flex flex-col gap-y-2 items-center justify-center w-screen h-screen">
          <p>
            AIPICはただいまメンテナンス中です。
            <br />
          </p>
          <p>
            ご利用の皆様にはご迷惑をおかけし、大変申し訳ありません。
            <br />
          </p>
          <p>
            メンテナンス終了までしばらくお待ち下さい。
            <br />
          </p>
        </main>
      </>
    </div>
  </>
);
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)

export default Maintenance;
