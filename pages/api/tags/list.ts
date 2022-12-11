import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "../../../utils/supabaseClient";

export const config = {
  runtime: 'experimental-edge',
};

const getImageList = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabaseClient
    .from("tags")
    .select(`*`)
    .order("count", { ascending: false });

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
