import { GetServerSideProps } from 'next'
import React from 'react'
import Head from 'next/head'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { res } = context
    res.statusCode = 503
    return { props: {} }
}

const Maintenance = () => (
  <>
    <Head>
      <title>AIPIC メンテナンス中</title>
    </Head>
    <div>
      <>
        <main className='dark:text-white flex flex-col gap-y-2 items-center justify-center w-screen h-screen'>
          <p>AIPICはただいまメンテナンス中です。<br/></p>
          <p>ご利用の皆様にはご迷惑をおかけし、大変申し訳ありません。<br/></p>
          <p>メンテナンス終了までしばらくお待ち下さい。<br/></p>
        </main>
      </>
    </div>
  </>
)

export default Maintenance