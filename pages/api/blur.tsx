import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React, { useState } from 'react';

export const config = {
  runtime: 'experimental-edge',
};

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);


    // ?title=<title>
    const hasImage = searchParams.has('image');
    const image = hasImage
      ? searchParams.get('image')?.slice(0, 100)
      : '';

    return new ImageResponse(
      (
        <div tw="flex w-full f-full" style={{backgroundImage: `url(${image})`,  backdropFilter: "blur(10px)"}}>
        </div>
      ),
      {
        width: 512,
        height: 768,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}