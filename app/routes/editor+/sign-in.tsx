import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";

import { Button } from "~/components/spectrum/Button";
import { Input } from "~/components/spectrum/Field";
import { commitAdminSession, getAdminSession } from "~/services/adminSession.server";

import crypto from "crypto";
import { getEditorByEmail } from "~/db/getEditorByEmail";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center">
      <div className="m-4 flex w-80 flex-col gap-4 border-t-2 border-blue-600 bg-[#f9fcff] p-4 shadow-sm drop-shadow-sm">
        <div className="text-center text-xl font-bold">Editor sign in</div>
        <Form method="post" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600" htmlFor="email">
              Email:
            </label>
            <Input name="email" id="email" type="text" required autoComplete="email" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600" htmlFor="password">
              Password:
            </label>
            <Input name="password" id="password" type="password" required autoComplete="password" />
          </div>

          <Button type="submit" className={"rounded-none"}>
            Sign in
          </Button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = z.string().parse(formData.get("email")).trim();
  const password = z.string().parse(formData.get("password")).trim();

  const editor = await getEditorByEmail(email);
  if (editor) {
    const genHash = crypto.pbkdf2Sync(password, editor.salt, 10000, 64, "sha512").toString("hex");
    if (editor.hashed_password === genHash) {
      const adminSession = await getAdminSession(request);
      adminSession.set("admin_id", editor.id);

      throw redirect("/editor", await commitAdminSession(adminSession));
    }
  } else {
    return null;
  }
}
