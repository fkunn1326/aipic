import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { data, error } = await supabaseClient
    .from("challenge")
    .select(`*`)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getImage;
