import { turso } from "~/services/turso.server";

export async function incrementArticleViews(articleId: string) {
  await turso.execute({
    sql: "UPDATE articles SET views = views + 1 WHERE id = ?;",
    args: [articleId],
  });
}
