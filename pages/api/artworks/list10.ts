import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getArtworks = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseClient = createServerSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  var query = supabaseClient
    .from("artworks")
    .select(
      `*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`
    )
    .order("created_at", { ascending: false })

  if (!session) {
    query = query.filter("age_limit", "in", `("all")`)
  }else{
    const { data } = await supabaseClient.from('profiles').select('*').eq("id", session.user.id).single();
    query = query.filter("age_limit", "in",  `("all","${data.access_limit.r18 && "r18"}","${data.access_limit.r18g && "r18g"}")`)
  }

  const { data, error } = await query.limit(10);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getArtworks;
