import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.query;
  const r18 =
    query.r18 === undefined ? false : JSON.parse(query.r18.toLowerCase());
  const r18g =
    query.r18g === undefined ? false : JSON.parse(query.r18g.toLowerCase());
  const keyword = query.keyword;
  const filter = `("all","${r18 && "r18"}","${r18g && "r18g"}")`;

  let sqlquery = supabaseClient
    .rpc("search_artworks", { keyword }, { count: "exact" })
    .order("created_at", { ascending: false })
    .filter("age_limit", "in", filter);

  if (query.page !== undefined)
    sqlquery = sqlquery.range((query.page - 1) * 20, query.page * 20 - 1);

  const { data, error, count } = await sqlquery;

  const response = {
    body: data,
    count: count,
  };

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(response);
};

export default search;
