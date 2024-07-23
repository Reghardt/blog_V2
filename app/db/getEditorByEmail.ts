import { turso } from "~/services/turso.server";

import { ZEditor } from "./schemas/editorSchema";

export async function getEditorByEmail(email: string) {
  const res = await turso.execute({
    sql: "SELECT * FROM editors WHERE email = ?;",
    args: [email],
  });

  const rows = ZEditor.array().parse(res.rows);
  const row = rows[0];
  return row ?? null;
}
