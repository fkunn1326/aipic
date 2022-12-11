import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const ImageUploadProfile = async (
  req: NextRequest,
  res: NextResponse
) => {
  const account_id = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string;
  const api_key = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string;

  let results = {
    code: 400,
    uploadURL: null,
    message: "処理が正しく完了しませんでした。",
  };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  try {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const formatted = date.toISOString();

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${account_id}/images/v1/direct_upload`,
      { expiry: formatted },
      {
        headers: {
          Authorization: `Bearer ${api_key}`,
          "Content-Type": "application/json",
        },
      }
    );

    const cloudflareImages = await response.data;

    if (cloudflareImages.success) {
      results.code = 200;
      (results.uploadURL = cloudflareImages.result.uploadURL),
        (results.message = "アップロードURLが正常に発行されました。");
    }
  } catch (e) {
    console.error(e);
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default ImageUploadProfile;
