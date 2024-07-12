import { turso } from "~/services/turso.server";

import { ZArticle } from "./schemas/articleSchema";

export async function getArticles() {
  const res = await turso.execute({
    sql: "SELECT id, created_at, title FROM articles ORDER BY id;",
    args: [],
  });

  const rows = ZArticle.omit({ content: true }).array().parse(res.rows);
  return rows;
}
