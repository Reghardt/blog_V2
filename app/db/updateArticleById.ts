import { turso } from "~/services/turso.server";

export async function updateArticleById(
  articleId: string,
  title: string,
  content: string,
  published: number,
  createdAt: string,
) {
  await turso.execute({
    sql: "UPDATE articles SET title = ?, content = ?, published = ?, created_at = ? WHERE id = ?;",
    args: [title, content, published, createdAt, articleId],
  });
}
