import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  var { id }: any = req.query;
  var { data, error }: any = await supabaseClient
    .from("profiles")
    .select(`id`)
    .eq("uid", id);
  var id = data[0].id

  var { data, error }: any = await supabaseClient
    .from("profiles")
    .select(`*, images:images(*)`)
    .eq("id", id)
    .eq("images.user_id", id)

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getUser;