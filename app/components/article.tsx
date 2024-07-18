import { parse } from "marked";
import { FC, ReactNode, useEffect, useState } from "react";

import { TArticle } from "~/db/schemas/articleSchema";

const Article: FC<{ article: TArticle; header?: ReactNode; footer?: ReactNode }> = ({ article, header, footer }) => {
  const [parsedArticleContent, setParsedArticleContent] = useState("");

  useEffect(() => {
    void (async () => {
      setParsedArticleContent(await parse(article.content, { async: true }));
    })();
  }, [article]);

  return (
    <div className="prose m-auto overflow-auto p-4 shadow-lg">
      {header}
      <h1>{article.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: parsedArticleContent,
        }}
      ></div>
      {footer}
    </div>
  );
};

export default Article;
