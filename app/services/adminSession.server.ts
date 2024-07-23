import { Session, createCookie, createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { z } from "zod";

export interface AdminSessionData {
  admin_id: number;
}

export interface AdminSessionFlashData {
  errorMsg: string;
  infoMsg: string;
}

invariant(process.env.ADMIN_SESSION_SECRET, "ADMIN_SESSION_SECRET undefined");

export const adminAuthCookie = createCookie("__admin_session", {
  // domain: ""
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 3, //3 days
  path: "/",
  sameSite: "lax",
  secrets: [process.env.ADMIN_SESSION_SECRET],
  secure: true,
});

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
  AdminSessionData,
  AdminSessionFlashData
>({
  cookie: adminAuthCookie,
});

async function getAdminSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session;
}

async function commitAdminSession(session: Session<AdminSessionData, AdminSessionFlashData>) {
  return {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

async function destroyAdminSession(session: Session<AdminSessionData, AdminSessionFlashData>) {
  return {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  };
}

export { getAdminSession, commitAdminSession, destroyAdminSession };

/**
 * @example throw await createThrowableAdminErrorMsg(session, "Error message", "url");
 * @param session
 * @param msg
 * @param redirectURL
 * @returns
 */
export async function createThrowableAdminErrorMsg(
  session: Session<AdminSessionData, AdminSessionFlashData>,
  msg: string,
  redirectURL = "",
) {
  session.flash("errorMsg", msg);
  return redirect(redirectURL, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function createThrowableAdminInfoMsg(
  session: Session<AdminSessionData, AdminSessionFlashData>,
  msg: string,
  redirectURL = "",
) {
  session.flash("infoMsg", msg);
  return redirect(redirectURL, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * throws redirect if an admin is not logged in - use as guard
 * @param session
 * @returns
 */
export async function getAdminSessionData(session: Session<AdminSessionData, AdminSessionFlashData>) {
  try {
    return z
      .object({
        admin_id: z.number({
          description: "admin_account_id in session data.",
        }),
      })
      .parse({
        admin_id: session.get("admin_id"),
      });
  } catch (error) {
    throw redirect("/editor/sign-in", {
      headers: {
        "Set-Cookie": await adminAuthCookie.serialize("", { maxAge: 0 }),
      },
    });
  }
}

export function getAdminSessionFlashData(session: Session<AdminSessionData, AdminSessionFlashData>) {
  return z.object({ errorMsg: z.string().optional(), infoMsg: z.string().optional() }).parse({
    errorMsg: session.get("errorMsg"),
    infoMsg: session.get("infoMsg"),
  });
}
