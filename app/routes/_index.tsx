import { ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { MetaFunction } from "@remix-run/node";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { getArticles } from "~/db/getArticles";
import { S3Service } from "~/services/s3.server";

export const meta: MetaFunction = () => {
  return [{ title: "Reghardt's Blog" }, { name: "description", content: "Welcome to Remix!" }];
};

export const loader = defineLoader(async () => {
  const articles = getArticles();

  console.log(await S3Service.send(new ListBucketsCommand("")));
  console.log(await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/" })));
  return { articles };
});

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="p-4 font-sans">
      <div className="flex justify-between">
        <h1 className="text-3xl">Reghardt&apos;s Blog</h1>
        <Link className="text-blue-700" to="editor">
          Editor Portal
        </Link>
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
                    <Link to={`article/${article.id}`}>View</Link>
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
