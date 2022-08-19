import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import type { Team } from "~/models/team.server";
import { getTeam } from "~/models/team.server";
import { getBookmarks } from "~/models/bookmarks.server";
import invariant from "tiny-invariant";
import { useContext, useEffect } from "react";
import { ModalContext } from "~/contexts/ModalContext";

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
  const data = useLoaderData<LoaderData>();
  const { setModal, modal } = useContext(ModalContext);
  useEffect(() => {
    const copy = { ...modal };
    modal!.team = data.team as unknown as Team;
    setModal(copy);
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}
