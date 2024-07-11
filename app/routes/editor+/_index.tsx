import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/spectrum/Button";
import { selectArticles } from "~/db/selectArticles";
import {
  getAdminSession,
  getAdminSessionData,
} from "~/services/adminSession.server";
import { turso } from "~/services/turso.server";

export const loader = defineLoader(async ({ request }) => {
  console.log("Loader fired");
  const session = await getAdminSession(request);
  await getAdminSessionData(session);

  const articles = await selectArticles();
  console.log(articles);
  return { articles };
});

export default function Editor() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div>Editor</div>
      <div>
        <Form method="post">
          <Button type="submit">Writer</Button>
        </Form>
      </div>
      <div>
        {loaderData.articles.map((article) => {
          return (
            <div key={article.id} className="bg-gray-300 p-2">
              <div>ID:{article.id}</div>
              <div>Title:{article.title}</div>
              <div>Created:{article.created_at}</div>
              <Link to={`${article.id}`}>Edit</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const action = defineAction(async ({ response }) => {
  const res = await turso.execute({
    sql: "INSERT INTO articles (title, content) VALUES (?, ?)",
    args: ["test", "test"],
  });
  console.log(res);
  const articleId = res.lastInsertRowid;

  response.status = 302;
  response.headers.set("Location", `${articleId}`);
  throw response;
  return null;
});
