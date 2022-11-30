import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getImageList = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseClient = createServerSupabaseClient({ req, res });

  const { page } = req.query;

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  let query = supabaseClient
    .from("artworks")
    .select(
      `*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })

  if (!session) {
    query = query.filter("age_limit", "in", `("all")`)
  }else{
    const { data } = await supabaseClient.from('profiles').select('*').eq("id", session.user.id).single();
    query = query.filter("age_limit", "in",  `("all","${data.access_limit.r18 && "r18"}","${data.access_limit.r18g && "r18g"}")`)
  }

  if (page !== undefined) {
    const pageint = parseInt(page as string);
    query = query.range((pageint - 1) * 20, pageint * 20 - 1);
  }

  const { data, error, count } = await query;

  const response = {
    body: data,
    count: count,
  };

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(response);
};

export default getImageList;