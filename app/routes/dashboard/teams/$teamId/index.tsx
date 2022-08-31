import { Link, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction, MetaFunction } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import React, { useContext } from "react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import type { getBookmarks } from "~/models/bookmarks.server";
import { createBookmark, deleteBookmark } from "~/models/bookmarks.server";
import { getTeam, resetCode } from "~/models/team.server";
import { deleteTeam, leaveTeam } from "~/models/team.server";
import { requireUserId } from "~/session.server";
import { useMatchesData, useUser } from "~/utils";
import logo from "~/branding/UN.webp";
import { TourContext } from "~/contexts/TourContext";
import BookmarkManager from "~/components/BookmarkManager";
import { ModalContext } from "~/contexts/ModalContext";

type CreateBookmarkActionData = {
  errors?: {
    name?: string;
    link?: string;
  };
};

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData["routes/dashboard/teams/$teamId"]?.team
    ? {
        title: `${parentsData["routes/dashboard/teams/$teamId"].team.name} - Overview - Unified Bookmarks`,
        "og:title": `${parentsData["routes/dashboard/teams/$teamId"].team.name} - Overview - Unified Bookmarks`,
        description: "View your team",

        "og:description": "View your team",
        "og:image": logo,
      }
    : {};
};

type LoaderData = {
  team: NonNullable<Awaited<ReturnType<typeof getTeam>>>;
  bookmarks: NonNullable<Awaited<ReturnType<typeof getBookmarks>>>;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.teamId, "teamId not found");

  const formData = await request.formData();
  const option = formData.get("option");

  if (option === "new_bookmark") {
    const name = formData.get("name");
    const link = formData.get("link");

    if (typeof name !== "string" || name.length === 0) {
      return json<CreateBookmarkActionData>(
        { errors: { name: "Name is required" } },
        { status: 400 }
      );
    }
    if (typeof link !== "string" || link.length === 0) {
      return json<CreateBookmarkActionData>(
        { errors: { link: "Link is required" } },
        { status: 400 }
      );
    }
    try {
      await createBookmark({
        name,
        link,
        teamId: params.teamId,
        userId,
      });
    } catch {
      return json<CreateBookmarkActionData>(
        { errors: { name: "Name already used" } },
        { status: 400 }
      );
    }
  }
  if (option === "delete_team") {
    await deleteTeam({ userId, id: params.teamId });
    return redirect("/dashboard/teams");
  }
  if (option === "leave_team") {
    await leaveTeam({ userId, id: params.teamId });
    return redirect("/dashboard/teams");
  }
  if (option === "bookmark") {
    const id = formData.get("id");
    invariant(id, "id not found");
    await deleteBookmark({ userId, id: id.toString() });
  }
  if (option === "reset_code") {
    await resetCode({ id: params.teamId, userId });
  }

  return null;
};

export default function BookmarkIndexPage() {
  const submit = useSubmit();
  const [confirm, setConfirm] = useState(false);
  const { modal } = useContext(ModalContext);
  const data = useMatchesData("routes/dashboard/teams/$teamId") as LoaderData;
  const user = useUser();
  const { tour, setTour } = useContext(TourContext);
  const owner = data.team.owner.id === user.id;

  return (
    <div className="flex h-full flex-col divide-x-2 divide-base-100 ">
      <div className="flex-grow space-y-5 p-5">
        <div className="space-y-1">
          <h2 className="text-3xl font-black">{data.team.name}</h2>
          <p>
            {data.team.users.length} Member{data.team.users.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex gap-5 overflow-auto pb-3">
          <Link to="users">
            <button className="btn btn-info">Manage Users</button>
          </Link>
          <label
            onClick={() => {
              if (tour === 2) setTour(3);
            }}
            htmlFor="invite"
            className={`btn btn-primary ${tour === 2 && "animate-pulse"}`}
          >
            Invite Member
          </label>
          <label htmlFor="delete-team" className={`btn btn-error`}>
            {owner ? "Delete Team" : "Leave Team"}
          </label>
        </div>
      </div>
      <div className="flex h-full w-full flex-col 2xl:w-[800px]">
        <BookmarkManager bookmarks={data.bookmarks} />
      </div>
    </div>
  );
}
