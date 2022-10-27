import * as React from "react";
import Head from "next/head";

interface Props {
  title: string;
}

const CummonHead = (props) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta property="og:title" content={props.title} />
      <meta property="og:site_name" content={props.title} />
      <meta name="twitter:title" content={props.title} />
    </Head>
  );
};

export default CummonHead;
