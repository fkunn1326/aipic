import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getTagSuggest = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.query;
  const word = query.word
  
  var { data, error } = await supabaseClient
    .from("tags")
    .select("*")
    .ilike('name', `%${word}%`)
    .order('count', { ascending: false })

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getTagSuggest;
