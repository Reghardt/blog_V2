import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/spectrum/Button";
import { createArticle } from "~/db/createArticle";
import { getArticles } from "~/db/getArticles";
import { getAdminSession, getAdminSessionData } from "~/services/adminSession.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Loader fired");
  const session = await getAdminSession(request);
  await getAdminSessionData(session);

  const articles = await getArticles(false);
  return json({ articles });
}

export default function Editor() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div>Editor</div>
      <div>
        <Link relative="route" to={"/"}>
          Home
        </Link>
        <Form method="post">
          <Button type="submit">Writer</Button>
        </Form>
      </div>
      <div className="flex flex-col gap-2">
        {loaderData.articles.map((article) => {
          return (
            <div key={article.id} className="rounded bg-gray-100 p-2">
              <div>{article.title}</div>
              <div>{article.created_at}</div>
              <Link to={`${article.id}`}>View</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function action() {
  const res = await createArticle();
  console.log(res);
  const articleId = res.lastInsertRowid;

  throw redirect(`${articleId}`);
}
