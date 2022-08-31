import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getTeams } from "~/models/team.server";
import Navbar from "~/components/Navbar";

import logo from "~/branding/UN.webp";
import Flow from "~/components/Flow";
import { Modals } from "~/components/modals";
export { ErrorBoundary, CatchBoundary } from "~/components/Errors";

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard - Unified Bookmarks",
    "og:title": "Dashboard - Unified Bookmarks",
    description: "Dashboard of Unified Bookmarks",

    "og:description": "Dashboard of Unified Bookmarks",
    "og:image": logo,
  };
};

type LoaderData = {
  teams: Awaited<ReturnType<typeof getTeams>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const teams = await getTeams({ userId });
  return json<LoaderData>({ teams });
};

export default function TeamsPage() {
  const data = useLoaderData<any>() as LoaderData;

  return (
    <>
      <Flow />
      <Modals />
      <div className="flex h-full min-h-screen flex-col divide-y-2 divide-base-200">
        <Navbar teams={data.teams}>
          <Outlet />
        </Navbar>
      </div>
    </>
  );
}
