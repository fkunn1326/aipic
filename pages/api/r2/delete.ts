import { NextApiRequest, NextApiResponse } from "next";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const account_id = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string;
const api_key = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string;

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, artwork_id } = req.body;

  try {
    var decoded = jwt.decode(token);

    var { data, error }: any = await supabaseAdmin
      .from("images")
      .select("*")
      .eq("id", artwork_id);

    if (data[0].user_id === decoded.sub) {
      try {
        await axios.delete(
          `https://api.cloudflare.com/client/v4/accounts/${account_id}/images/v1/image-${artwork_id}`,
          {
            headers: {
              Authorization: `Bearer ${api_key}`,
            },
          }
        );
      } catch (e) {
        return res.status(200).end();
      }

      return res.status(200).end();
    }
  } catch (err) {
    return res.status(403).json({ error: err });
  }
  return res.status(200);
};

export default Delete;
