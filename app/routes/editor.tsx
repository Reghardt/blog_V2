import { Editor, type OnChange } from "@monaco-editor/react";
import { unstable_defineAction as defineAction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { marked } from "marked";
import { useState } from "react";

import { Button } from "~/components/spectrum/Button";
import { turso } from "~/services/turso.server";

export default function MonacoEditor() {
  // @ts-expect-error error due to single fetch being unstable
  const fetcher = useFetcher();

  const [art, setArt] = useState("");

  const handleEditorChange: OnChange = (value, _ev) => {
    console.log(_ev);
    console.log("here is the current model value:", value);
    if (value) {
      void marked.parse(value, { async: true }).then((value) => {
        setArt(value);
      });
    }
  };

  function saveArticle() {
    fetcher.submit({ title: "test", content: "test 2" }, { method: "POST" });
  }

  return (
    <div className="grid h-[100svh] overflow-hidden">
      <div className="flex bg-gray-900">
        <Button
          className={"rounded-none py-1"}
          onPress={() => {
            saveArticle();
          }}
        >
          Save
        </Button>
      </div>
      <div className="flex h-full">
        <div className="h-full">
          <Editor
            width={"50vw"}
            defaultLanguage="markdown"
            defaultValue=""
            theme="vs-dark"
            onChange={handleEditorChange}
          />
        </div>
        <div
          className="prose m-2 h-full w-full overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: art }}
        />
      </div>
    </div>
  );
}

export const action = defineAction(async ({ request }) => {
  const body = await request.formData();
  body.forEach((value, key) => {
    console.log(value, key);
  });

  const res = await turso.execute({
    sql: "INSERT INTO articles (title, content) VALUES (?, ?)",
    args: ["test", "test"],
  });

  console.log(res);
  return null;
});
