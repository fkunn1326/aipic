import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const getImageList = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { data, error } = await supabaseClient.from('images').select(`*, author: user_id(*), likes: likes(id, user_id)`).eq('id', id);
    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data);
};

export default getImageList;