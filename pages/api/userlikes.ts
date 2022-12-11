import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getUser = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ? searchParams.get("page") : undefined;

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
    return new Response(JSON.stringify({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    }), {
      status: 401,
      headers: {
        'content-type': 'application/json',
      },
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

export default getUser;
