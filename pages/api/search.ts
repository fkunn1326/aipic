import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.query;
  const r18 =
    query.r18 === undefined ? false : JSON.parse(query.r18.toLowerCase());
  const r18g =
    query.r18g === undefined ? false : JSON.parse(query.r18g.toLowerCase());
  const keyword = query.keyword
  const filter = `("all","${r18 && "r18"}","${r18g && "r18g"}")`;
  var { data, error } = await supabaseClient
    .rpc("search_images", { keyword })
    .order("created_at", { ascending: false })
    .filter("age_limit", "in", filter);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default search;
