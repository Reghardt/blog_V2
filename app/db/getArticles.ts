import { ResultSet } from "@libsql/client";

import { turso } from "~/services/turso.server";

import { ZArticle } from "./schemas/articleSchema";

export async function getArticles(onlyPublished: boolean = true) {
  let res: ResultSet | null = null;
  if (onlyPublished) {
    res = await turso.execute({
      sql: "SELECT id, created_at, title, publish FROM articles WHERE publish = 1 ORDER BY id;",
      args: [],
    });
  } else {
    res = await turso.execute({
      sql: "SELECT id, created_at, title, publish FROM articles ORDER BY id;",
      args: [],
    });
  }

  const rows = ZArticle.omit({ content: true }).array().parse(res.rows);
  return rows;
}
