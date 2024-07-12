import invariant from "tiny-invariant";

import { turso } from "~/services/turso.server";

import { ZArticle } from "./schemas/articleSchema";

export async function getArticleById(article_id: string) {
  const res = await turso.execute({
    sql: "SELECT * FROM articles WHERE id = ?;",
    args: [article_id],
  });

  const rows = ZArticle.array().parse(res.rows);
  const row = rows[0];
  invariant(row, "empty row");
  return row;
}
