import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { produce } from "immer";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

import Article from "~/components/article";
import { Button } from "~/components/spectrum/Button";
import { DatePicker } from "~/components/spectrum/DatePicker";
import { getArticleById } from "~/db/getArticleById";
import { updateArticleById } from "~/db/updateArticleById";
import { ZListObjectsCommandV2Response } from "~/schemas/listObjectsCommandV2Response";
import { S3Service } from "~/services/S3/S3Service.server";
import { calendarDateToSqliteDate } from "~/utils/calendarDateToSqliteDate";
import { sqliteDateToCalendarDate } from "~/utils/sqliteDateToCalendarDate";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const article_id = params.article;
  invariant(article_id, "article id undefined");
  const article = await getArticleById(article_id);

  const prefix = new URL(request.url).searchParams.get("prefix") ?? "";
  const listResult = ZListObjectsCommandV2Response.parse(
    await S3Service.send(new ListObjectsV2Command({ Bucket: "rem-blog", Delimiter: "/", Prefix: prefix })),
  );

  return json({
    article,
    listResult,
    prefix,
  });
}

export default function Write() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [articleTitle, setArticleTitle] = useState(loaderData.article.title);
  const [articleContent, setArticleContent] = useState(loaderData.article.content);
  const [published, setPublished] = useState(loaderData.article.published);
  const [date, setDate] = useState(sqliteDateToCalendarDate(loaderData.article.created_at));
  const [mobileZLevels, setMobileZLevels] = useState<[number, number, number, number]>([3, 2, 1, 0]);

  const [isMinimized, setIsMinimized] = useState(true);

  function incMobileZLevel(index: number) {
    setMobileZLevels(
      produce(mobileZLevels, (draft) => {
        draft[index] = Math.max(...mobileZLevels) + 1;
      }),
    );
  }

  const editorRef = useRef<HTMLDivElement>(null);

  function saveArticle() {
    fetcher.submit(
      { title: articleTitle, content: articleContent, published, created_at: calendarDateToSqliteDate(date) },
      { method: "POST" },
    );
  }

  return (
    <>
      <div className="hidden h-screen flex-col lg:flex">
        <div className="flex h-8 justify-between bg-gray-200">
          <div className="flex">
            <Link
              to=".."
              relative="path"
              unstable_viewTransition
              className="pressed:bg-blue-800 flex w-12 items-center justify-center bg-blue-600 text-sm text-white hover:bg-blue-700"
            >
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
            <input
              className="px-2"
              type="text"
              value={articleTitle}
              onChange={(e) => {
                setArticleTitle(e.target.value);
              }}
            ></input>

            <div className="flex items-center gap-2 px-2">
              <input
                className="h-5 w-5"
                type="checkbox"
                id="publish"
                checked={Boolean(published)}
                onChange={(e) => {
                  setPublished(+e.target.checked);
                }}
              />
              <label htmlFor="publish">Publish</label>
            </div>

            <DatePicker
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
            />
          </div>

          <Button
            className={"rounded-none py-1"}
            onPress={() => {
              setIsMinimized(!isMinimized);
            }}
          >
            Images
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[50%] bg-gray-100" ref={editorRef}>
            <textarea
              className="h-full w-full bg-gray-800 p-1 text-white"
              value={articleContent}
              onChange={(c) => {
                setArticleContent(c.target.value);
              }}
            />
          </div>

          <div className="w-[50%] overflow-auto">
            <Article
              article={{
                id: loaderData.article.id,
                created_at: loaderData.article.created_at,
                title: articleTitle,
                content: articleContent,
                published: published,
                views: loaderData.article.views,
              }}
            />
          </div>
        </div>

        <div className="absolute right-2 top-8 h-[96%] w-96">
          <Outlet context={{ isMinimized: isMinimized }} />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="h-[5svh]">
          <Button
            onPress={() => {
              incMobileZLevel(0);
            }}
          >
            Edit
          </Button>
          <Button
            onPress={() => {
              incMobileZLevel(1);
            }}
          >
            View
          </Button>

          <Button
            onPress={() => {
              incMobileZLevel(2);
            }}
          >
            Options
          </Button>

          <Button
            onPress={() => {
              incMobileZLevel(3);
              setIsMinimized(false);
            }}
          >
            Images
          </Button>
        </div>

        <div className="overflow-hidden">
          <textarea
            className="absolute h-[95svh] w-full overflow-auto bg-gray-700 p-1 text-white"
            style={{ zIndex: mobileZLevels[0] }}
            defaultValue={loaderData.article.content}
            onChange={(c) => {
              setArticleContent(c.target.value);
            }}
          />

          <div className="absolute h-[95svh] w-full overflow-auto bg-white" style={{ zIndex: mobileZLevels[1] }}>
            <Article
              article={{
                id: loaderData.article.id,
                created_at: loaderData.article.created_at,
                title: articleTitle,
                content: articleContent,
                published: published,
                views: loaderData.article.views,
              }}
            />
          </div>

          <div
            className="absolute flex h-[95svh] w-full flex-col gap-2 bg-white p-2"
            style={{ zIndex: mobileZLevels[2] }}
          >
            <Link
              to=".."
              relative="path"
              unstable_viewTransition
              className="pressed:bg-blue-800 flex w-12 items-center justify-center bg-blue-600 p-1 text-sm text-white hover:bg-blue-700"
            >
              Back
            </Link>

            <input
              className="rounded border-2 border-gray-300 px-2"
              type="text"
              value={articleTitle}
              onChange={(e) => {
                setArticleTitle(e.target.value);
              }}
            ></input>

            <DatePicker
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
            />

            <div className="flex items-center gap-2 px-2">
              <input
                className="h-5 w-5"
                type="checkbox"
                id="publish"
                checked={Boolean(published)}
                onChange={(e) => {
                  setPublished(+e.target.checked);
                }}
              />
              <label htmlFor="publish">Publish</label>
            </div>

            <Button
              className={"rounded-none py-1"}
              onPress={() => {
                saveArticle();
              }}
            >
              Save
            </Button>
          </div>

          <div className="absolute h-[95svh] w-full bg-white" style={{ zIndex: mobileZLevels[3] }}>
            <Outlet context={{ isMinimized: isMinimized }} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = z.string().parse(body.get("title"));
  const content = z.string().parse(body.get("content"));
  const published = z.coerce.number().min(0).max(1).parse(body.get("published"));
  const created_at = z.string().parse(body.get("created_at"));

  const articleId = params.article;
  invariant(articleId, "article id undefined");

  await updateArticleById(articleId, title, content, published, created_at);
  return null;
}
