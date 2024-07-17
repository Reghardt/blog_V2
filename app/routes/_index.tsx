import { ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

import { getArticles } from "~/db/getArticles";
import { S3Service } from "~/services/S3/S3Service.server";

export const meta: MetaFunction = () => {
  return [{ title: "Reghardt's Blog" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader() {
  const articles = await getArticles();

  console.log(await S3Service.send(new ListBucketsCommand("")));
  console.log(await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/" })));
  return json({ articles });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center">
      <div className="w-[36em] p-4 font-sans">
        <div className="flex justify-between">
          <h1 className="text-3xl">Reghardt&apos;s Blog</h1>
          <Link className="text-blue-700" to="editor">
            Editor Portal
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {loaderData.articles.map((article) => {
            return (
              <div key={article.id} className="rounded bg-gray-100 p-2">
                <div>{article.title}</div>
                <div>{article.created_at}</div>
                <Link to={`article/${article.id}`}>View</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
