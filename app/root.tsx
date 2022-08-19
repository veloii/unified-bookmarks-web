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
import { useEffect, useState } from "react";
import { isServer } from "./utils";
import type { Tour } from "./contexts/TourContext";
import { TourContextProvider } from "./contexts/TourContext";
import { Modals } from "~/components/modals";
import type { PasswordActionData } from "./contexts/PasswordActionDataContext";
import { PasswordActionDataContextProvider } from "./contexts/PasswordActionDataContext";
import Toasts from "./components/Toasts";
export { ErrorBoundary, CatchBoundary } from "./components/ErrorsBrand";

if (!isServer()) {
  loadCSS("https://rsms.me/inter/inter.css");
  loadCSS(
    "https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
  );
  loadCSS(globalsStylesheetUrl);
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

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
  const [tour, setTour] = useState<Tour>(false);
  const [passwordActionData, setPasswordActionData] =
    useState<PasswordActionData>();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <PasswordActionDataContextProvider
      value={{ passwordActionData, setPasswordActionData }}
    >
      <TourContextProvider value={{ tour, setTour }}>
        <html lang="en" className="h-full overflow-x-hidden">
          <head>
            <Meta />
            <Links />
          </head>
          <body className="h-full">
            <Toasts />
            <Modals />
            <Outlet />
            <LiveReload />
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </TourContextProvider>
    </PasswordActionDataContextProvider>
  );
}
