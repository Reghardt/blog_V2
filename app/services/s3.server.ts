import { S3Client } from "@aws-sdk/client-s3";
import invariant from "tiny-invariant";

invariant(import.meta.env.VITE_AWS_ACCESS_KEY_ID, "VITE_AWS_ACCESS_KEY_ID undefined");
invariant(import.meta.env.VITE_AWS_SECRET_ACCESS_KEY, "VITE_AWS_SECRET_ACCESS_KEY undefined");

export const S3Service = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
