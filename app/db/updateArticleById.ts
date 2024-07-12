import { turso } from "~/services/turso.server";

export async function updateArticleById(articleId: string, title: string, content: string) {
  await turso.execute({
    sql: "UPDATE articles SET title = ?, content = ? WHERE id = ?;",
    args: [title, content, articleId],
  });
}
