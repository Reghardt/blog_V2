import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Editor } from "@monaco-editor/react";
import { unstable_defineAction as defineAction, unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TextArea } from "react-aria-components";
import invariant from "tiny-invariant";
import { z } from "zod";

import Article from "~/components/article";
import { Button } from "~/components/spectrum/Button";
import { getArticleById } from "~/db/getArticleById";
import { updateArticleById } from "~/db/updateArticleById";
import { ZListObjectsCommandV2Response } from "~/schemas/listObjectsCommandV2Response";
import { S3Service } from "~/services/S3/S3Service.server";

export const loader = defineLoader(async ({ request, params }) => {
  const article_id = params.article;
  invariant(article_id, "article id undefined");
  const article = await getArticleById(article_id);

  const prefix = new URL(request.url).searchParams.get("prefix") ?? "";
  // console.log(await S3Service.send(new ListBucketsCommand("")));
  // console.log(await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/" })));

  const listResult = ZListObjectsCommandV2Response.parse(
    await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/", Prefix: prefix })),
  );
  console.log(listResult);

  invariant(import.meta.env.VITE_AWS_S3_BUCKET_NAME, "VITE_AWS_S3_BUCKET_NAME undefined");
  invariant(import.meta.env.VITE_AWS_S3_ENDPOINT, "VITE_AWS_S3_ENDPOINT undefined");

  return {
    article,
    listResult,
    prefix,
    s3BucketName: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
    s3Endpoint: import.meta.env.VITE_AWS_S3_ENDPOINT,
  };
});

export default function Write() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-expect-error single fetch
  const fetcher = useFetcher();

  const [articleTitle, setArticleTitle] = useState(loaderData.article.title);
  const [articleContent, setArticleContent] = useState(loaderData.article.content);

  function handleEditorChange(value: string = "") {
    setArticleContent(value);
  }

  useEffect(() => {
    handleEditorChange(loaderData.article.content);
  }, [loaderData.article.content]);

  function saveArticle() {
    fetcher.submit({ title: articleTitle, content: articleContent }, { method: "POST" });
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-8 bg-gray-200">
        <Link to=".." relative="path" unstable_viewTransition className="w-12 bg-blue-600 text-center text-white">
          Back
        </Link>
        <Button
          className={"rounded-none py-1"}
          onPress={() => {
            saveArticle();
          }}
        >
          Save
        </Button>
        <TextArea
          value={articleTitle}
          onChange={(e) => {
            setArticleTitle(e.target.value);
          }}
        ></TextArea>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100">
          <Editor
            defaultLanguage="markdown"
            defaultValue={loaderData.article.content}
            theme="vs-dark"
            onChange={handleEditorChange}
          />
        </div>

        <div className="flex-1 overflow-auto bg-gray-50">
          <Article
            article={{
              id: loaderData.article.id,
              created_at: loaderData.article.created_at,
              title: articleTitle,
              content: articleContent,
            }}
          />
        </div>
      </div>

      {/* <ImageBrowser prefix={loaderData.prefix} listResult={loaderData.listResult}  /> */}
      <Outlet />
    </div>
  );
}

export const action = defineAction(async ({ request, params }) => {
  const body = await request.formData();
  const title = z.string().parse(body.get("title"));
  const content = z.string().parse(body.get("content"));

  const articleId = params.article;
  invariant(articleId, "article id undefined");

  await updateArticleById(articleId, title, content);
  return null;
});
