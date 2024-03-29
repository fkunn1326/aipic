import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  var { data, error }: any = await supabaseClient
    .from("likes")
    .select("*, image:images(*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id))")
    .eq("user_id", id)
    .order("created_at")

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getUser;