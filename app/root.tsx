import { themeChange } from "theme-change";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { loadCSS } from "fg-loadcss";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import globalsStylesheetUrl from "./styles/globals.css";
import { getUser } from "./session.server";
import Flow from "./components/Flow";
import { useEffect } from "react";
import { isServer } from "./utils";
export { ErrorBoundary, CatchBoundary } from "./components/ErrorsBrand";

if (!isServer()) {
  loadCSS(tailwindStylesheetUrl);
  loadCSS(globalsStylesheetUrl);
  loadCSS(
    "https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
  );
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  "theme-color": "#6419e6",
  themeColor: "#6419e6",
  title: "Unified Bookmarks",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  useEffect(() => {
    themeChange(false);
  }, []);
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Flow />
        <Outlet />
        <LiveReload />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
