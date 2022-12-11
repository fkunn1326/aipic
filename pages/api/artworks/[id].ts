import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "../../../utils/supabaseClient";

export const config = {
  runtime: 'experimental-edge',
};

const getArtwork = async (req: NextRequest, res: NextResponse) => {
  const { href } = new URL(req.url)
  const id = href.split("/").pop()

  const { data, error } = await supabaseClient.rpc("get_images").eq("id", id);
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

export default getArtwork;
