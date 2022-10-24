import * as React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
}

export default ({ title }: Props): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta name="twitter:title" content={title} />
    </Head>
  );
};