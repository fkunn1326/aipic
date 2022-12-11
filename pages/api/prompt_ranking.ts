import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
	runtime: 'experimental-edge',
};

const getDailyRank = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabaseClient = createServerSupabaseClient({ req, res });

  var { data: ranking, error } = await supabaseClient
    .from("prompts")
    .select("*")
    .order("count", { ascending: false })
    .limit(6)

	const { data: artworks } = await supabaseClient
		.rpc("get_images")
		.filter("age_limit", "in", `("all")`)
    .order("views", { ascending: false })
	
	const l = ranking?.map((v) => {return v.name})

	const data: any[] = []

	artworks?.map((k) => {
		k?.image_contents?.map((v) => {
			if (k.id !== data.slice(-1)?.[0]?.id){
				if (v?.promptarr.includes(l?.[0])){
					k["prompt"] = l?.shift()
					data.push(k)
				}
			}
		})
	})

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