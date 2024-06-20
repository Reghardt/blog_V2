import { createClient } from "@libsql/client";
import invariant from "tiny-invariant";

invariant(
  import.meta.env.VITE_TURSO_DATABASE_URL,
  "VITE_TURSO_DATABASE_URL undefined",
);
invariant(
  import.meta.env.VITE_TURSO_AUTH_TOKEN,
  "VITE_TURSO_AUTH_TOKEN undefined",
);

export const turso = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});
