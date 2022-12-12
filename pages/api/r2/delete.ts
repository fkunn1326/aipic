import { NextApiRequest, NextApiResponse } from "next";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const account_id = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string;
const api_key = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string;

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabaseClient = createServerSupabaseClient({ req, res });
  
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const { image_id } = req.body;

  try {
    var { data, error }: any = await supabaseAdmin
      .from("images")
      .select("id")
      .eq("id", image_id);

    if (data[0].user_id === session?.user.id) {
      try {
        var { data, error }: any = await axios.delete(
          `https://api.cloudflare.com/client/v4/accounts/${account_id}/images/v1/image-${image_id}`,
          {
            headers: {
              Authorization: `Bearer ${api_key}`,
            },
          }
        );
      } catch (err) {
        return res.status(403).json({ error: error });
      }

      return res.status(200).end();
    }
  } catch (err) {
    return res.status(403).json({ error: error });
  }
  return res.status(200);
};

export default Delete;
