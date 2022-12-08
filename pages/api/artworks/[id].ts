import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "../../../utils/supabaseClient";

/**
 * @swagger
 * /api/artworks/[id]:
 *   get:
 *     description: Artworksのリストを取得します
 *     parameters:
 *       - name: name
 *         description: アナタの名前
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 正常にレスポンスが返されます
 */

const getArtwork = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { data, error } = await supabaseClient.rpc("get_images").eq("id", id);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getArtwork;
