import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const Copies = async (req: NextRequest, res: NextResponse) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    })
  }
  const { artwork_id } = await req.json()
  try {
    var { data, error }: any = await supabaseAdmin
      .from("artworks")
      .select("copies,daily_point")
      .eq("id", artwork_id);
    await supabaseAdmin
      .from("artworks")
      .update({
        copies: data[0].copies + 1,
        daily_point: data[0].daily_point + 2,
      })
      .eq("id", artwork_id);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
};

export default Copies;
