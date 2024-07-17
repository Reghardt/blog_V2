import { createClient } from "@libsql/client";
import invariant from "tiny-invariant";

invariant(process.env.TURSO_DATABASE_URL, "TURSO_DATABASE_URL undefined");
invariant(process.env.TURSO_AUTH_TOKEN, "TURSO_AUTH_TOKEN undefined");

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
