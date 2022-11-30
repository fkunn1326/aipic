import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseClient = createServerSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  var { uid, page } = req.query;

  var userquery = supabaseClient
    .from("profiles")
    .select(
      `id, uid, name, header_url, avatar_url, introduce`,
      { count: "exact" }
    )

  var query = supabaseClient
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
    query = query.filter("age_limit", "in",  `("all","${data.age_limit?.r18 && "r18"}","${data.age_limit?.r18g && "r18g"}")`)
  }

  if (page !== undefined) {
    const pageint = parseInt(page as string);
    query = query.range((pageint - 1) * 20, pageint * 20 - 1);
  }

  try {
    var { data, error }: any = await supabaseClient
      .from("profiles")
      .select(`id`)
      .eq("uid", uid);
    var id = data[0].id;
  } catch (err) {
    return res.status(404).json({ error: "This user is not defined" })
  }

  var { data: userdata, error: usererror } = await userquery
    .eq("id", id)
    .single();

  var { data: artworks, count, error: artworkserror } = await query
    .eq("user_id", id)

  const response = {
    user: userdata,
    body : artworks,
    count: count,
  };

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(response);
};

export default getUser;
