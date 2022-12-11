import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'experimental-edge',
};

const getImageList = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ? searchParams.get("page") : undefined;

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

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 401,
    headers: {
      'content-type': 'application/json',
    },
  });
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default getImageList;