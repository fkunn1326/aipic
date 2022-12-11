import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

const getUser = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const { pathname, searchParams } = new URL(req.url)
  const uid = pathname.split("/").pop()
  const page = searchParams.get("page") ? searchParams.get("page") : undefined;

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
    return new Response(JSON.stringify({ error: "This user is not defined" }), {
      status: 404,
      headers: {
        'content-type': 'application/json',
      },
    });
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
