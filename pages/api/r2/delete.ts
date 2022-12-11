import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const account_id = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID as string;
const api_key = process.env.CLOUDFLARE_IMAGES_API_TOKEN as string;

const Delete = async (req: NextRequest, res: NextResponse) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  const supabaseClient = createMiddlewareSupabaseClient({ req, res });
  
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const { image_id } = await req.json()

  try {
    var { data, error }: any = await supabaseAdmin
      .from("images")
      .select("id")
      .eq("id", image_id);

    if (data[0].user_id === session?.user.id) {
      try {
        var { data, error }: any = await axios.delete(
          `https://api.cloudflare.com/client/v4/accounts/${account_id}/images/v1/image-${image_id}`,
          {
            headers: {
              Authorization: `Bearer ${api_key}`,
            },
          }
        );
      } catch (err) {
        return new Response(JSON.stringify({ error: error }), {
          status: 403,
          headers: {
            'content-type': 'application/json',
          },
        });
      }
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default Delete;
