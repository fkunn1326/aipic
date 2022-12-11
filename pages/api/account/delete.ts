import { NextApiRequest, NextApiResponse } from "next";
import { S3Client } from "@aws-sdk/client-s3";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY as string,
  },
});

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseClient = createServerSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!session){
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    });
  }else{
    try {
      await supabaseAdmin.from("images").delete().match({ user_id: session.user.id });
      await supabaseAdmin.from("likes").delete().match({ user_id: session.user.id });
      await supabaseAdmin.from("profiles").delete().match({ id: session.user.id });
      await supabaseAdmin.auth.admin.deleteUser(session.user.id);
    } catch (err) {
      return res.status(403).json({ error: err });
    }
  }
  return res.status(200);
};

export default Delete;
