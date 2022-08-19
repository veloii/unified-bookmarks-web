import { Link, Links, Meta, Scripts, useCatch } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import { loadCSS } from "fg-loadcss";
import { isServer } from "~/utils";
import Header from "./Header";
import globalsStylesheetUrl from "~/styles/globals.css";
import { useEffect } from "react";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  useEffect(() => {
    loadCSS("https://rsms.me/inter/inter.css");
    loadCSS(
      "https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
    );
    loadCSS(globalsStylesheetUrl);
  }, []);

  console.error(error);
  return (
    <html className="bg-white">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <div className="absolute top-1/2 w-full -translate-y-1/2 text-center font-brand text-black">
          <div className="space-y-1">
            <h2 className="text-9xl">{error.name}</h2>
            <p className="text-lg text-primary">{error.message}</p>
          </div>
          <Link
            to="/"
            className="btn btn-md mt-10 h-2.5 min-h-[2.5rem] rounded-full bg-slate-900 px-5 normal-case text-white"
          >
            Go to Home
          </Link>
        </div>
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              CHROME_EXTENSION_URL: "",
            })}`,
          }}
        />
      </body>
    </html>
  );
};

export function CatchBoundary() {
  useEffect(() => {
    loadCSS("https://rsms.me/inter/inter.css");
    loadCSS(
      "https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
    );
    loadCSS(globalsStylesheetUrl);
  }, []);
  const caught = useCatch();
  return (
    <html className="bg-white">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <div className="absolute top-1/2 w-full -translate-y-1/2 text-center font-brand text-black">
          <div className="space-y-1">
            <h2 className="text-9xl">{caught.status}</h2>
            <p className="text-lg text-primary">{caught.statusText}</p>
          </div>
          <Link
            to="/"
            className="btn btn-md mt-10 h-2.5 min-h-[2.5rem] rounded-full bg-slate-900 px-5 normal-case text-white"
          >
            Go to Home
          </Link>
        </div>
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              CHROME_EXTENSION_URL: "",
            })}`,
          }}
        />
      </body>
    </html>
  );
}
