import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
	runtime: 'experimental-edge',
};

const getDailyRank = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  var query = supabaseClient
    .from("artworks")
    .select(
      `*, author: user_id(name, avatar_url, uid), likes: likes(id, user_id)`
    )
    .order("daily_point", { ascending: false })

  if (!session) {
    query = query.filter("age_limit", "in", `("all")`)
  }else{
    const { data } = await supabaseClient.from('profiles').select('*').eq("id", session.user.id).single();
    query = query.filter("age_limit", "in",  `("all","${data.access_limit.r18 && "r18"}","${data.access_limit.r18g && "r18g"}")`)
  }

  const { data, error } = await query.limit(20);

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

export default getDailyRank;
