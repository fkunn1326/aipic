// pages/api/protected-route.ts
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

const Account = async (req, res) => {
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
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

  const { data } = await supabase.from('profiles').select('*').eq("id", session.user.id).single();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export default Account;