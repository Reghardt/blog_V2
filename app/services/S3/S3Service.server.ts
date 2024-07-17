import { S3Client } from "@aws-sdk/client-s3";
import invariant from "tiny-invariant";

invariant(process.env.AWS_ACCESS_KEY_ID, "AWS_ACCESS_KEY_ID undefined");
invariant(process.env.AWS_SECRET_ACCESS_KEY, "AWS_SECRET_ACCESS_KEY undefined");
invariant(process.env.AWS_S3_ENDPOINT, "AWS_S3_ENDPOINT undefined");

export const S3Service = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
