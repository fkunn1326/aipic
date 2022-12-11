// pages/api/protected-route.ts
import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const Account: NextApiHandler = async (req, res) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    });

  const { data } = await supabase.from('profiles').select('*').eq("id", session.user.id).single();
  res.json(data);
};

export default Account;