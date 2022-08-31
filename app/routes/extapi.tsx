import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import {
  createBookmark,
  deleteBookmark,
  editBookmark,
  getBookmarkByName,
} from "~/models/bookmarks.server";
import { getTeamByNameDiscrim, getTeamsBookmarks } from "~/models/team.server";
import { requireUserId } from "~/session.server";
import splitDiscrimAndFriendlyName from "~/utils";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const teamName = formData.get("team_name");
  invariant(teamName, "team_name not found");
  const option = formData.get("option");
  const [teamFriendlyName, teamDiscrim] = splitDiscrimAndFriendlyName(
    teamName.toString()
  );
  const team = await getTeamByNameDiscrim({
    userId,
    name: teamFriendlyName,
    discrim: teamDiscrim,
  });
  invariant(team, "Cannot find team");

  if (option === "new_bookmark") {
    const name = formData.get("name");
    const link = formData.get("link");
    invariant(name, "name not found");
    invariant(link, "link not found");

    if (typeof name !== "string" || name.length === 0)
      return json({ status: 400 });
    if (typeof link !== "string" || link.length === 0)
      return json({ status: 400 });

    await createBookmark({
      name,
      link,
      teamId: team.id,
      userId,
    });
  }
  if (option === "delete_bookmark") {
    const bookmarkName = formData.get("bookmark_name");
    invariant(bookmarkName, "bookmark_name not found");
    const bookmark = await getBookmarkByName({
      name: bookmarkName.toString(),
      teamId: team.id,
      userId,
    });
    invariant(bookmark, "Cannot find bookmark");
    await deleteBookmark({ userId, id: bookmark.id });
  }
  if (option === "change_bookmark") {
    const beforeName = formData.get("before_name");
    const afterName = formData.get("after_name");
    const afterLink = formData.get("after_link");
    invariant(beforeName, "before_name not found");
    invariant(afterName, "after_name not found");
    invariant(afterLink, "after_link not found");

    const bookmark = await getBookmarkByName({
      name: beforeName.toString(),
      teamId: team.id,
      userId,
    });
    invariant(bookmark, "Cannot find bookmark");

    const update = await editBookmark({
      id: bookmark.id,
      name: afterName.toString(),
      link: afterLink.toString(),
      userId,
      teamId: team.id,
    });
    invariant(update, "Update has conflicts");
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const teams = await getTeamsBookmarks({ userId });
  return teams.map((team) => ({
    ...team,
    name: `${team.name}#${team.discrim}`,
    friendlyName: team.name,
  }));
};
