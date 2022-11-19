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

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { filename, token, image_id } = req.body;

    try {
        var decoded = jwt.decode(token)

        var { data, error }: any = await supabaseAdmin.from("images").select("*").eq("id", image_id)
        if (data[0].user_id === decoded.sub){
            await supabaseAdmin
                .from('likes')
                .delete()
                .match({
                    image_id: image_id,
                })
            
            await supabaseAdmin
                .from('images')
                .delete()
                .match({
                    id: image_id,
                })
            return res.status(200).end();
        }
        
    }catch (err) {
        return res.status(403).json({"error": err});
    }
    return res.status(200);
};

export default Delete;