import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page } = req.query;

  const supabaseClient = createServerSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  var query = supabaseClient
    .from("likes")
    .select(
      "*, artworks:artworks(*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id))",
      { count: "exact" }
    )
    .not("artwork_id", "is", "null")
    .order("created_at");

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    });
  }else{
    const { data } = await supabaseClient.from('profiles').select('*').eq("id", session.user.id).single();
    query = query
    .filter("artworks.age_limit", "in",  `("all","${data.access_limit.r18 && "r18"}","${data.access_limit.r18g && "r18g"}")`)
    .match({
      user_id: session.user?.id,
    })
  }

  if (page !== undefined) {
    const pageint = parseInt(page as string);
    query = query.range((pageint - 1) * 20, pageint * 20 - 1);
  }

  var { data, count, error }: any = await query.order("created_at", { ascending: true })

  const response = {
    body: data,
    count: count,
  };

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(response);
};

export default getUser;
