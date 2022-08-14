import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getTeam, getTeams } from "~/models/team.server";
import { getBookmarks } from "~/models/bookmarks.server";
import invariant from "tiny-invariant";

type LoaderData = {
  team: NonNullable<Awaited<ReturnType<typeof getTeam>>>;
  bookmarks: NonNullable<Awaited<ReturnType<typeof getBookmarks>>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.teamId, "teamId not found");

  const team = await getTeam({ userId, id: params.teamId });
  const bookmarks = await getBookmarks({ userId, teamId: params.teamId });
  if (!team || !bookmarks) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ team, bookmarks });
};

export default function TeamsPage() {
  return <Outlet />;
}
