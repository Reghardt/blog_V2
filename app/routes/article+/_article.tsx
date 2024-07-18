import { Outlet } from "@remix-run/react";

export default function ArticleLayout() {
  return (
    <div className="space-y-4" style={{ scrollbarGutter: "stable" }}>
      <div className="flex justify-center">
        <div className="w-[36em] space-y-8 p-4 font-sans">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">Reghardt&apos;s Blog</h1>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
