import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getTagsCount = async (tag: string) => {
  const { data, error } = await supabaseClient
    .from("images")
    .select(`*`)
    .contains("tags", [tag])
    .order("created_at")
  return data!.length
}

const getTagSuggest = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.query;
  const word = query.word
  
  var { data, error } = await supabaseClient
    .from("tags")
    .select("*")
    .ilike('tag', `%${word}%`)

  data = await Promise.all(
      data!.map(async (tag) => ({
        name: tag["tag"],
        id: tag["id"],
        count: await getTagsCount(tag["tag"])
      })),
  );

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getTagSuggest;
