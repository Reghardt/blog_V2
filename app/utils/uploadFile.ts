import { PutObjectCommand } from "@aws-sdk/client-s3";
import invariant from "tiny-invariant";

import { S3Service } from "~/services/S3/S3Service.server";

export async function uploadFile(file: File, prefix: string, customFileName?: string) {
  invariant(process.env.AWS_S3_BUCKET_NAME, "AWS_S3_BUCKET_NAME undefined");

  const putObjectCommandOutput = await S3Service.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: prefix + file.name,
      Body: Buffer.from(await file.arrayBuffer()),
    }),
  );

  console.log(putObjectCommandOutput);
}
