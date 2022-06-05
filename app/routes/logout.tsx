import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { signout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return signout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
