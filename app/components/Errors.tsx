import { Link, Links, Meta, Scripts, useCatch } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="absolute top-1/2 w-full -translate-y-1/2 text-center text-white">
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
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="text-whi absolute top-1/2 w-full -translate-y-1/2 text-center">
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
