import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "../../../utils/supabaseClient";

const getImage = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") ? searchParams.get("id") : undefined;
  
  const { data, error } = await supabaseClient
    .from("images")
    .select(`*, author: user_id(name, avatar_url, uid))`)
    .eq("id", id)
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 401,
    headers: {
      'content-type': 'application/json',
    },
  });

  return new Response(JSON.stringify({
    version: "1.0",
    type: "rich",
    height: 315,
    width: 600,
    work_type: "illust",
    html: `<iframe width=\"600\" height=\"315\" src=\"https://www.aipic.app/artworks/${id}\" frameborder=\"0\"></iframe>`,
    title: data?.title,
    thumbnail_url: data?.href,
    author_name: data?.author.name,
    author_url: `https://www.aipic.app/users/${data?.author.uid}`,
    provider_name: "AIPIC",
    provider_url: "https://www.aipic.app/",
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default getImage;
