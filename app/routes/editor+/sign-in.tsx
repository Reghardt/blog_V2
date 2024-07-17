import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { Button } from "~/components/spectrum/Button";
import { commitAdminSession, getAdminSession } from "~/services/adminSession.server";

export default function SignIn() {
  return (
    <div>
      <div>Editor sign in</div>
      <Form method="post">
        <Button type="submit">Sign in</Button>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const adminSession = await getAdminSession(request);
  adminSession.set("admin_id", 100);

  console.log("Sign in");

  // response.headers.set("Set-Cookie", await commitAdminSession(adminSession));
  // response.status = 302;
  // response.headers.set("Location", "/");
  // throw response;

  throw redirect("/", {
    headers: {
      "Set-Cookie": await commitAdminSession(adminSession),
    },
  });
}
