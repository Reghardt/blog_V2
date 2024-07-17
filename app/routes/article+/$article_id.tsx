import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Article from "~/components/article";
import { getArticleById } from "~/db/getArticleById";

export async function loader({ params }: LoaderFunctionArgs) {
  const article_id = params.article_id;
  invariant(article_id, "article_id undefined");

  const article = await getArticleById(article_id);

  return json({ article });
}

export default function ArticleId() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="">
      <div>
        <Link to={"/"}>{"< Back"}</Link>
      </div>
      <Article article={loaderData.article} />
    </div>
  );
}
