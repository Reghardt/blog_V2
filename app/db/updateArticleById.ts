import { turso } from "~/services/turso.server";

export async function updateArticleById(articleId: string, title: string, content: string, publish: number) {
  await turso.execute({
    sql: "UPDATE articles SET title = ?, content = ?, publish = ? WHERE id = ?;",
    args: [title, content, publish, articleId],
  });
}
