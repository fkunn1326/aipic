import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const Views = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { artwork_id } = req.body;
  try {
    var { data, error }: any = await supabaseAdmin
      .from("artworks")
      .select("views,daily_point")
      .eq("id", artwork_id);
    await supabaseAdmin
      .from("artworks")
      .update({
        views: data[0].views + 1,
        daily_point: data[0].daily_point + 1,
      })
      .eq("id", artwork_id);

    return res.status(200).end();
  } catch (err) {
    return res.status(403).json({ error: err });
  }
  return res.status(200).end();
};

export default Views;
