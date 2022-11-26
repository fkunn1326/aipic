import { NextApiRequest, NextApiResponse } from "next";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import md5 from "md5";
import multer from "multer";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY as string,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const multermw = multer({
  storage: multer.memoryStorage(),
});

async function buffer(readable: Readable) {
  const chunks: any[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const HeaderUpload = async (req: any, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body: any = await new Promise((resolve, reject) => {
      multermw.single("file")(req, res, (err: any) => {
        if (err) return reject(err);
        resolve({ file: req.file, name: req.body.name, type: req.body.type });
      });
    });

    let { name, type, file } = body;

    const data = await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME as string,
        Key: `headers/${name}.png`,
        Body: file.buffer,
        ContentType: type,
      })
    );

    return res
      .status(201)
      .json({
        url: `https://pub-25066e52684e449b90f5170d93e6c396.r2.dev/headers/${name}.png`,
      });
  } catch (err) {
    if (err.hasOwnProperty("$metadata")) {
      console.error(
        `Error - Status Code: ${err.$metadata.httpStatusCode} - ${err.message}`
      );
    } else {
      console.error("Error", err);
    }
  }
};

export default HeaderUpload;
