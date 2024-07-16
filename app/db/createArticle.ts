import { turso } from "~/services/turso.server";

export async function createArticle() {
  return await turso.execute({
    sql: "INSERT INTO articles (title, content) VALUES (?, ?)",
    args: ["Title", "Content"],
  });
}
