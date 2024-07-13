import { PutObjectCommand } from "@aws-sdk/client-s3";
import invariant from "tiny-invariant";

import { S3Service } from "~/services/S3/S3Service.server";

export async function uploadFile(file: File, prefix: string, customFileName?: string) {
  invariant(import.meta.env.VITE_AWS_S3_BUCKET_NAME, "VITE_AWS_S3_BUCKET_NAME undefined");

  console.log(file, prefix, customFileName);

  const putObjectCommandOutput = await S3Service.send(
    new PutObjectCommand({
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      Key: prefix + file.name,
      Body: Buffer.from(await file.arrayBuffer()),
      // ContentType: "application/pdf",
    }),
  );

  console.log(putObjectCommandOutput);

  //   return putObjectCommandOutput.$metadata.httpStatusCode === 200 ? true : false;
}
