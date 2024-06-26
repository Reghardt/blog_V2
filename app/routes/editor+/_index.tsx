import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import {
  getAdminSession,
  getAdminSessionData,
} from "~/services/adminSession.server";

export const loader = defineLoader(async ({ request }) => {
  console.log("Loader fired");
  const session = await getAdminSession(request);
  await getAdminSessionData(session);
  return null;
});

export default function Editor() {
  return (
    <div className="grid h-[100svh] overflow-hidden">
      <div>Editor</div>
      <div>
        <Link to="write">Write</Link>
      </div>
    </div>
  );
}

export const action = defineAction(async ({ request }) => {
  return null;
});
