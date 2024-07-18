import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import EyeIcon from "~/components/icons/eyeIcon";
import { Button } from "~/components/spectrum/Button";
import { createArticle } from "~/db/createArticle";
import { getArticles } from "~/db/getArticles";
import { getAdminSession, getAdminSessionData } from "~/services/adminSession.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getAdminSession(request);
  await getAdminSessionData(session);

  const articles = await getArticles(false);
  return json({ articles });
}

export default function Editor() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center">
      <div className="w-[36em] space-y-8 p-4 font-sans">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Editor portal</h1>
          <Link relative="route" className="text-blue-700" to={"/"}>
            Home
          </Link>
        </div>
        <div>
          <Form method="post">
            <Button type="submit">New article</Button>
          </Form>
        </div>

        <div className="flex flex-col gap-3">
          {loaderData.articles.map((article) => {
            return (
              <Link
                to={`${article.id}`}
                key={article.id}
                className="flex flex-col gap-4 rounded bg-slate-100 p-2 shadow-sm drop-shadow-sm active:bg-slate-300 hover:bg-slate-200"
              >
                <div className="text-lg font-bold">{article.title}</div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">{article.created_at}</div>
                  <div className="flex items-center gap-1">
                    <EyeIcon />
                    <div className="text-sm">{article.views}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  Published:{" "}
                  {article.published ? (
                    <div className="text-green-600">True</div>
                  ) : (
                    <div className="text-red-600">False</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
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
