import { Outlet } from "@remix-run/react";

export default function ArticleLayout() {
  return (
    <div>
      <div>Article</div>
      <Outlet />
    </div>
  );
}
