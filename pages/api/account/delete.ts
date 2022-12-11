import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: 'experimental-edge',
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const Delete = async (req: NextRequest, res: NextResponse) => {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  if (!session){
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
    try {
      await supabaseAdmin.from("images").delete().match({ user_id: session.user.id });
      await supabaseAdmin.from("likes").delete().match({ user_id: session.user.id });
      await supabaseAdmin.from("profiles").delete().match({ id: session.user.id });
      await supabaseAdmin.auth.admin.deleteUser(session.user.id);
    } catch (err) {
      return new Response(JSON.stringify({ error: err }), {
        status: 403,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  }
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default Delete;
