import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  var { id }: any = req.query;
  const query: any = req.query;
  const r18 =
    query.r18 === undefined ? false : JSON.parse(query.r18.toLowerCase());
  const r18g =
    query.r18g === undefined ? false : JSON.parse(query.r18g.toLowerCase());
  const filter = `("all","${r18 && "r18"}","${r18g && "r18g"}")`;

  try {
    var { data, error }: any = await supabaseClient
      .from("profiles")
      .select(`id`)
      .eq("uid", id);
    var id = data[0].id;
  } catch (err) {}

  var { data, error }: any = await supabaseClient
    .from("profiles")
    .select(
      `id, uid, name, header_url, avatar_url, introduce, artworks:artworks(*, likes:likes(*))`
    )
    .filter("artworks.age_limit", "in", filter)
    .eq("id", id)
    .eq("artworks.user_id", id)
    .order("created_at", { foreignTable: "artworks" });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getUser;
