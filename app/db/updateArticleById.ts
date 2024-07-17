import { turso } from "~/services/turso.server";

export async function updateArticleById(
  articleId: string,
  title: string,
  content: string,
  publish: number,
  createdAt: string,
) {
  await turso.execute({
    sql: "UPDATE articles SET title = ?, content = ?, publish = ?, created_at = ? WHERE id = ?;",
    args: [title, content, publish, createdAt, articleId],
  });
}
