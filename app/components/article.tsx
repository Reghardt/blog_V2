import { parse } from "marked";
import { FC, useEffect, useState } from "react";

import { TArticle } from "~/db/schemas/articleSchema";

const Article: FC<{ article: TArticle }> = ({ article }) => {
  const [parsedArticleContent, setParsedArticleContent] = useState("");

  useEffect(() => {
    void (async () => {
      setParsedArticleContent(await parse(article.content, { async: true }));
    })();
  }, [article]);

  console.log(parsedArticleContent);

  return (
    <div className="prose overflow-auto">
      <h1>{article.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: parsedArticleContent,
        }}
      ></div>
    </div>
  );
};

export default Article;
