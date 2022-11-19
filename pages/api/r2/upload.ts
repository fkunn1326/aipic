import axios from 'axios'
import FormData from 'form-data'
import type { NextApiRequest, NextApiResponse } from 'next'

const ImageUploadProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const account_id = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string
  const api_key = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string

  let results = {
    code: 400,
    uploadURL: null,
    message: '処理が正しく完了しませんでした。'
  }

  if (req.method !== 'POST') {
    return res.status(400).json(results)
  }

  try {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const formatted = date.toISOString();

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${account_id}/images/v1/direct_upload`,
      {"expiry": formatted},
      {
        headers: {
          "Authorization": `Bearer ${api_key}`,
          "Content-Type": "application/json"
        },
      }
    )

    const cloudflareImages = await response.data

    console.log(cloudflareImages)

    if (cloudflareImages.success) {
      results.code = 200
      ;(results.uploadURL = cloudflareImages.result.uploadURL),
        (results.message = 'アップロードURLが正常に発行されました。')
    }
  } catch (e) {console.error(e)}

  return res.status(200).json(results)
}

export default ImageUploadProfile