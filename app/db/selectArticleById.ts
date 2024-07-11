import invariant from "tiny-invariant";

import { turso } from "~/services/turso.server";

import { zArticle } from "./schemas/articleSchema";

export async function selectArticleById(article_id: string) {
  const res = await turso.execute({
    sql: "SELECT * FROM articles WHERE id = ?;",
    args: [article_id],
  });

  const rows = zArticle.array().parse(res.rows);
  const row = rows[0];
  invariant(row, "empty row");
  return row;
}
