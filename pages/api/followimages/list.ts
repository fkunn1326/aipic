import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'experimental-edge',
};

const getImageList = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {
    var query = supabaseClient
      .from("random_artworks")
      .select(
        `*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`
      )
  }else{
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq("id", session.user.id).single();
    const { data: follows } = await supabaseClient.from("follows").select("*").eq("following_uid", session.user.id);
    var query = supabaseClient
      .from("artworks")
      .select(
        `*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`
      )
      .order("created_at", { ascending: false })
      .filter("age_limit", "in",  `("all","${profile.access_limit?.r18 && "r18"}","${profile.access_limit?.r18g && "r18g"}")`)
      .filter("user_id", "in", `(${follows?.map((follow) => {return follow?.followed_uid}).join(",")})`)
  }
  
  const { data, error } = await query.limit(5);

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 401,
    headers: {
      'content-type': 'application/json',
    },
  });
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default getImageList;
