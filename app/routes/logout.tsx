import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/session.server";
import type { MetaFunction } from "@remix-run/server-runtime";
import logo from "~/branding/UN.webp";

export const meta: MetaFunction = () => {
  return {
    title: "Logout - Unified Bookmarks",
    description: "Logout of Unifed Bookmarks",
    "twitter:card": "summary_large_image",
    "og:description": "Logout of Unified Bookmarks",
    "og:image": logo,
  };
};

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
