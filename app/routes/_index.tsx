import type { MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

import EyeIcon from "~/components/icons/eyeIcon";
import { getArticles } from "~/db/getArticles";

export const meta: MetaFunction = () => {
  return [{ title: "Reghardt's Blog" }, { name: "description", content: "" }];
};

export async function loader() {
  const articles = await getArticles();
  return json({ articles });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center">
      <div className="w-[66ch] space-y-8 p-4 font-sans">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Reghardt&apos;s Blog</h1>
          <Link className="text-blue-700" to="editor">
            Editor Portal
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {loaderData.articles.map((article) => {
            return (
              <Link
                to={`article/${article.id}`}
                key={article.id}
                className="flex flex-col gap-4 rounded bg-slate-100 p-2 shadow-sm drop-shadow-sm hover:bg-slate-200 active:bg-slate-300"
              >
                <div className="text-lg font-bold">{article.title}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">{article.created_at}</div>
                  <div className="flex items-center gap-1">
                    <EyeIcon />
                    <div className="text-sm">{article.views}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
