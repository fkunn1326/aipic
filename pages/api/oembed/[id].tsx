import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { data, error } = await supabaseClient
    .from("images")
    .select(`*, author: user_id(name, avatar_url, uid))`)
    .eq("id", id);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({
    "version": "1.0",
    "type": "rich",
    "height": 315,
    "width": 600,
    "work_type": "illust",
    "html": `<iframe width=\"600\" height=\"315\" src=\"https://www.aipic.app/artworks/${id}\" frameborder=\"0\"></iframe>`,
    "title": data[0].title,
    "thumbnail_url": data[0].href,
    "author_name": data[0].author.name,
    "author_url": `https://www.aipic.app/users/${data[0].author.uid}`,
    "provider_name": "AIPIC",
    "provider_url": "https://www.aipic.app/"
  });
};

export default getImage;