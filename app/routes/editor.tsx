import { Editor, type OnChange } from "@monaco-editor/react";
import { marked } from "marked";
import { useState } from "react";

export default function MonacoEditor() {
  const [art, setArt] = useState("");

  async function handleEditorChange(value, ev) {
    console.log("here is the current model value:", value);
    if (value) {
      setArt(await marked.parse(value, { async: true }));
    }
  }

  return (
    <div className="flex h-[100svh] overflow-hidden">
      <div className="">
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
  );
}
