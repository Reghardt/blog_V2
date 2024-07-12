import { Editor } from "@monaco-editor/react";
import { unstable_defineAction as defineAction, unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TextArea } from "react-aria-components";
import invariant from "tiny-invariant";
import { z } from "zod";

import Article from "~/components/article";
import { Button } from "~/components/spectrum/Button";
import { getArticleById } from "~/db/getArticleById";
import { updateArticleById } from "~/db/updateArticleById";

export const loader = defineLoader(async ({ params }) => {
  const article_id = params.article_id;
  invariant(article_id, "article id undefined");
  const article = await getArticleById(article_id);
  return { article };
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

  //   return (
  //     <div className="flex h-full max-h-full flex-col">
  //       <div className="1fr">Test</div>
  //       <div className="grid grid-cols-[1fr_1fr]">
  //         <div className="h-full overflow-auto">
  //           <Editor
  //             // width={"50vw"}

  //             defaultLanguage="markdown"
  //             defaultValue={"# Hello"}
  //             theme="vs-dark"
  //             // onChange={handleEditorChange}
  //           />
  //         </div>

  //         <div className="h-full overflow-auto">
  //           <div className="h-[800px]">Test 2</div>
  //         </div>

  //         {/* <div className="grid grid-cols-2">
  //           <div className="h-full overflow-auto bg-green-300">
  //             <div className="h-[80em]">Test</div>
  //           </div>
  //           <div className=""></div> */}
  //         {/* <div className="h-full">
  //         <div className="flex bg-gray-900">
  //           <Link to=".." relative="path" unstable_viewTransition className="w-12 bg-blue-600 text-center text-white">
  //             Back
  //           </Link>
  //           <Button
  //             className={"rounded-none py-1"}
  //             onPress={() => {
  //               saveArticle();
  //             }}
  //           >
  //             Save
  //           </Button>
  //           <TextArea
  //             value={articleTitle}
  //             onChange={(e) => {
  //               setArticleTitle(e.target.value);
  //             }}
  //           ></TextArea>
  //         </div>
  //         <div className="grid h-full grid-cols-2">
  //           <Editor
  //             // width={"50vw"}

  //             defaultLanguage="markdown"
  //             defaultValue={loaderData.article.content}
  //             theme="vs-dark"
  //             onChange={handleEditorChange}
  //           />

  //           <Article
  //             article={{
  //               id: loaderData.article.id,
  //               created_at: loaderData.article.created_at,
  //               title: articleTitle,
  //               content: articleContent,
  //             }}
  //           />
  //         </div>
  //       </div> */}
  //       </div>
  //     </div>
  //   );
  // }

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
    </div>
  );
}

export const action = defineAction(async ({ request, params }) => {
  const body = await request.formData();
  const title = z.string().parse(body.get("title"));
  const content = z.string().parse(body.get("content"));

  const articleId = params.article_id;
  invariant(articleId, "article id undefined");

  await updateArticleById(articleId, title, content);
  return null;
});
