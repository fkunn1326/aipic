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

const Views = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { token, image_id, type } = req.body;
    try {
        var decoded = jwt.decode(token)
        var { data, error }: any = await supabaseAdmin.from("images").select("daily_point").eq("id", image_id)
        if(type === "add"){
            await supabaseAdmin
            .from('images')
            .update({
                daily_point: data[0].daily_point + 3 < 0 ? 0 : data[0].daily_point + 3 
            })
            .eq("id", image_id)
        }else{
            await supabaseAdmin
            .from('images')
            .update({
                daily_point: data[0].daily_point - 3 < 0 ? 0 : data[0].daily_point - 3 
            })
            .eq("id", image_id)
        }
            
        return res.status(200).end();        
    }catch (err) {
        return res.status(403).json({"error": err});
    }
    return res.status(200).end();
};

export default Views;