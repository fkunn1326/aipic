import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getArtworks = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.query;
  const r18 =
    query.r18 === undefined ? false : JSON.parse(query.r18.toLowerCase());
  const r18g =
    query.r18g === undefined ? false : JSON.parse(query.r18g.toLowerCase());
  const filter = `("all","${r18 && "r18"}","${r18g && "r18g"}")`;

  const { data, error } = await supabaseClient
    .from("artworks")
    .select(`*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`)
    .order("created_at", {ascending: false})
    .filter("age_limit", "in", filter)
    .limit(10)
    
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getArtworks;