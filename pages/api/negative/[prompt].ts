import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getPrompt = async (req: NextApiRequest, res: NextApiResponse) => {
  var { prompt } = req.query;
  const { data, error } = await supabaseClient
    .from("images")
    .select(`*, author: user_id(name, avatar_url), likes: likes(id, user_id)`)
    .contains("npromptarr", [prompt])
    .order("created_at");
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getPrompt;
