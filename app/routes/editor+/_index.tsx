import { unstable_defineAction as defineAction, unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Await, Form, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { Button } from "~/components/spectrum/Button";
import { getArticles } from "~/db/getArticles";
import { getAdminSession, getAdminSessionData } from "~/services/adminSession.server";
import { turso } from "~/services/turso.server";

export const loader = defineLoader(async ({ request }) => {
  console.log("Loader fired");
  const session = await getAdminSession(request);
  await getAdminSessionData(session);

  const articles = getArticles();
  return { articles };
});

export default function Editor() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div>Editor</div>
      <div>
        <Link to={"/"}>Home</Link>
        <Form method="post">
          <Button type="submit">Writer</Button>
        </Form>
      </div>
      <div className="flex flex-col gap-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={loaderData.articles}>
            {(articles) =>
              articles.map((article) => {
                return (
                  <div key={article.id} className="rounded bg-gray-100 p-2">
                    <div>{article.title}</div>
                    <div>{article.created_at}</div>
                    <Link to={`${article.id}`}>View</Link>
                  </div>
                );
              })
            }
          </Await>
        </Suspense>
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
