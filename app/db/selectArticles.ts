import { turso } from "~/services/turso.server";

import { zArticle } from "./schemas/articleSchema";

export async function selectArticles() {
  const res = await turso.execute({
    sql: "SELECT id, created_at, title FROM articles ORDER BY id;",
    args: [],
  });

  const rows = zArticle.omit({ content: true }).array().parse(res.rows);
  return rows;
}
