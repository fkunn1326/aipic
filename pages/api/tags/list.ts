import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "../../../utils/supabaseClient";

const getImageList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabaseClient
    .from("tags")
    .select(`*`)
    .order("count", { ascending: false });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getImageList;
