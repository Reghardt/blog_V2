import { vitePlugin as remix } from "@remix-run/dev";
import { glob } from "glob"; // TODO: What is glob? What and how can it be used for?
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: {
    noExternal: [
      "@adobe/react-spectrum",
      "@react-spectrum/*",
      "@spectrum-icons/*",
    ].flatMap((spec) => glob.sync(`${spec}`, { cwd: "node_modules/" })),
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
