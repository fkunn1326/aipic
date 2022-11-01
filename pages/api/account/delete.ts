import { NextApiRequest, NextApiResponse } from "next";
import {
    DeleteObjectCommand ,
    S3Client
  } from '@aws-sdk/client-s3'
import jwt from "jsonwebtoken"
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY as string,
    },
});

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { token } = req.body;

    try {
        var decoded = jwt.decode(token)

        await supabaseAdmin
            .from("images")
            .delete()
            .match({ user_id: decoded.sub })

        await supabaseAdmin
            .from("likes")
            .delete()
            .match({ user_id: decoded.sub })

        await supabaseAdmin
            .from("profiles")
            .delete()
            .match({ id: decoded.sub })

        await supabaseAdmin.auth.api.deleteUser(
            decoded.sub
        )
        
    }catch (err) {
        return res.status(403).json({"error": err});
    }
    return res.status(200);
};

export default Delete;
