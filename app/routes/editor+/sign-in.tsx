import { unstable_defineLoader as defineLoader } from "@remix-run/node";

import {
  getAdminSession,
  getAdminSessionData,
} from "~/services/adminSession.server";

export const loader = defineLoader(async ({ request }) => {
  //   console.log("Loader fired");
  //   const session = await getAdminSession(request);
  //   await getAdminSessionData(session);
  return null;
});

export default function SignIn() {
  return <div>Editor sign in</div>;
}
