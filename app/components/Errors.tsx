import { Link, Links, Meta, Scripts, useCatch } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import { loadCSS } from "fg-loadcss";
import { isServer } from "~/utils";
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
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="absolute top-1/2 w-full -translate-y-1/2 text-center text-base-content">
          <div className="space-y-1">
            <h2 className="text-7xl font-black">{error.name}</h2>
            <p className="text-lg">{error.message}</p>
          </div>
          <Link to="/dashboard/teams" className="btn btn-primary mt-5">
            Go to Dashboard
          </Link>
        </div>
        <Scripts />
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
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="absolute top-1/2 w-full -translate-y-1/2 text-center text-base-content">
          <div className="space-y-1">
            <h2 className="text-7xl font-black">{caught.status}</h2>
            <p className="text-lg">{caught.statusText}</p>
          </div>
          <Link to="/dashboard/teams" className="btn btn-primary mt-5">
            Go to Dashboard
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
