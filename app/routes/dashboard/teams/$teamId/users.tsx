import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Link, useSubmit } from "@remix-run/react";
import type { ActionFunction, MetaFunction } from "@remix-run/server-runtime";
import React from "react";
import invariant from "tiny-invariant";
import type { getBookmarks } from "~/models/bookmarks.server";
import type { getTeam } from "~/models/team.server";
import { banUser, kickUser, transferTeam } from "~/models/team.server";
import { requireUserId } from "~/session.server";
import { useMatchesData, useUser } from "~/utils";
import logo from "~/branding/UN.webp";

type LoaderData = {
  team: NonNullable<Awaited<ReturnType<typeof getTeam>>>;
  bookmarks: NonNullable<Awaited<ReturnType<typeof getBookmarks>>>;
};

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData["routes/dashboard/teams/$teamId"]?.team
    ? {
        title: `${parentsData["routes/dashboard/teams/$teamId"].team.name} - Users - Unified Bookmarks`,
        "og:title": `${parentsData["routes/dashboard/teams/$teamId"].team.name} - Users - Unified Bookmarks`,
        description: "View users",

        "og:description": "View users",
        "og:image": logo,
      }
    : {};
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.teamId, "teamId not found");

  const formData = await request.formData();
  const option = formData.get("option");
  const user = formData.get("user");
  invariant(user, "user not found");

  if (option === "transfer") {
    await transferTeam({
      id: params.teamId,
      userId,
      transferedId: user.toString(),
    });
  }
  if (option === "ban") {
    await banUser({ userId, bannedUserId: user.toString(), id: params.teamId });
  }
  if (option === "kick") {
    await kickUser({
      userId,
      kickedUserId: user.toString(),
      id: params.teamId,
    });
  }

  return null;
};

export default function BookmarkIndexPage() {
  const data = useMatchesData("routes/dashboard/teams/$teamId") as LoaderData;
  const myUser = useUser();
  const submit = useSubmit();
  const owner = myUser.id === data.team.owner.id;

  return (
    <div>
      <Link to="..">
        <button className="btn btn-circle ml-5 mt-5 inline-flex gap-4">
          <ArrowLeftIcon width={20} />
        </button>
      </Link>
      <div className="rounded-box overflow-x-auto p-5">
        <table className="table w-full shadow">
          <thead>
            <tr>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.team.users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td className="space-x-5">
                  <button
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("option", "ban");
                      formData.append("user", user.id);
                      submit(formData, { method: "post" });
                    }}
                    className={`btn btn-error ${
                      user.id === myUser.id || !owner ? "btn-disabled" : ""
                    }`}
                  >
                    Ban
                  </button>
                  <button
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("option", "ban");
                      formData.append("user", user.id);
                      submit(formData, { method: "post" });
                    }}
                    className={`btn btn-warning ${
                      user.id === myUser.id || !owner ? "btn-disabled" : ""
                    }`}
                  >
                    Kick
                  </button>
                  <button
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("option", "transfer");
                      formData.append("user", user.id);
                      submit(formData, { method: "post" });
                    }}
                    className={`btn btn-accent ${
                      user.id === myUser.id || !owner ? "btn-disabled" : ""
                    }`}
                  >
                    Transfer Ownership
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
