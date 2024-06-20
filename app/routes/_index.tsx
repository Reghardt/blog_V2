import type { MetaFunction } from "@remix-run/node";

import { Button } from "~/components/spectrum/Button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <div>Test</div>
      <Button
        className={"px-4 py-1"}
        onPress={() => {
          console.log("Press");
        }}
      >
        Press me
      </Button>
    </div>
  );
}
