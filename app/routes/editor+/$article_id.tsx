import { Editor, type OnChange } from "@monaco-editor/react";
import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { useState } from "react";
import { TextArea } from "react-aria-components";
import invariant from "tiny-invariant";
import { z } from "zod";

import { Button } from "~/components/spectrum/Button";
import { selectArticleById } from "~/db/selectArticleById";
import { turso } from "~/services/turso.server";

export const loader = defineLoader(async ({ params }) => {
  const article_id = params.article_id;
  invariant(article_id, "article id undefined");

  const article = await selectArticleById(article_id);

  return { article };
});

export default function Write() {
  const loaderData = useLoaderData<typeof loader>();

  // @ts-expect-error error due to single fetch being unstable
  const fetcher = useFetcher();

  const [articleTitle, setArticleTitle] = useState(loaderData.article.title);

  const [articleContent, setArticleContent] = useState(
    loaderData.article.content,
  );

  const handleEditorChange: OnChange = (value, _ev) => {
    console.log(_ev);
    console.log("here is the current model value:", value);
    if (value) {
      void marked.parse(value, { async: true }).then((value) => {
        setArticleContent(value);
      });
    }
  };

  function saveArticle() {
    fetcher.submit(
      { title: articleTitle, content: articleContent },
      { method: "POST" },
    );
  }

  return (
    <div className="grid h-[100svh] grid-rows-[2em_1fr] overflow-hidden">
      <div className="flex bg-gray-900">
        <Link
          to=".."
          relative="path"
          unstable_viewTransition
          className="w-12 bg-blue-600 text-center text-white"
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
        <TextArea
          value={articleTitle}
          onChange={(e) => {
            setArticleTitle(e.target.value);
          }}
        ></TextArea>
      </div>
      <div className="flex h-full">
        <div className="h-full">
          <Editor
            width={"50vw"}
            defaultLanguage="markdown"
            defaultValue={articleContent}
            theme="vs-dark"
            onChange={handleEditorChange}
          />
        </div>
        <div
          className="prose m-2 h-full w-full overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />
      </div>
    </div>
  );
}

export const action = defineAction(async ({ request, params }) => {
  const body = await request.formData();
  body.forEach((value, key) => {
    console.log(value, key);
  });
  const title = z.string().parse(body.get("title"));
  const content = z.string().parse(body.get("content"));

  const article_id = params.article_id;
  invariant(article_id, "article id undefined");

  const res = await turso.execute({
    sql: "UPDATE articles SET title = ?, content = ? WHERE id = ?;",
    args: [title, content, article_id],
  });

  console.log(res);
  return null;
});
