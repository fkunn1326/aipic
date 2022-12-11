import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "../../../utils/supabaseClient";

const getTagSuggest = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get("word") ? searchParams.get("word") : undefined;

  var { data, error } = await supabaseClient
    .from("tags")
    .select("*")
    .ilike("name", `%${word}%`)
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

export default getTagSuggest;
