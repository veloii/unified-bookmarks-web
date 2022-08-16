import { PlusCircleIcon, XIcon } from "@heroicons/react/solid";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import React from "react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "~/models/bookmarks.server";
import { deleteTeam, getTeam, leaveTeam } from "~/models/team.server";
import { requireUserId } from "~/session.server";
import { useMatchesData, useUser } from "~/utils";
import logo from "~/branding/UN.webp";

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
        description: "View your team",
        "twitter:card": "summary_large_image",
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
        { errors: { name: "Link is required" } },
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

  return null;
};

export default function BookmarkIndexPage() {
  const submit = useSubmit();
  const [confirm, setConfirm] = useState(false);
  const copyToClipboardRef = useRef<HTMLButtonElement>(null);
  const data = useMatchesData("routes/dashboard/teams/$teamId") as LoaderData;
  const user = useUser();
  const owner = data.team.owner.id === user.id;
  const actionData = useActionData() as CreateBookmarkActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLInputElement>(null);
  const [codeType, setCodeType] = useState<"code" | "link">("code");

  React.useEffect(() => {
    if (actionData?.errors?.name) nameRef.current?.focus();
    if (actionData?.errors?.link) linkRef.current?.focus();
  }, [actionData]);

  return (
    <div className="flex h-full flex-col divide-x-2 divide-base-100 ">
      <div className="flex-grow space-y-5 p-5">
        <div className="space-y-1">
          <h2 className="text-3xl font-black">{data.team.name}</h2>
          <p>
            {data.team.users.length} Member{data.team.users.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex gap-5">
          <label
            onClick={() => setCodeType("link")}
            htmlFor="invite"
            className="btn btn-primary"
          >
            Invite Member with link
          </label>
          <label
            onClick={() => setCodeType("code")}
            htmlFor="invite"
            className="btn btn-primary"
          >
            Invite Member with code
          </label>
          <input type="checkbox" id="invite" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Invite {codeType}</h3>
              <kbd className="kbd mt-4">
                {codeType === "code"
                  ? data.team.code
                  : `https://unifiedbookmarks.com/code/${data.team.code}`}
              </kbd>

              <div className="modal-action">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      codeType === "code"
                        ? data.team.code
                        : `https://unifiedbookmarks.com/code/${data.team.code}`
                    );
                    copyToClipboardRef.current!.innerText = "Copied!";
                    setTimeout(
                      () =>
                        (copyToClipboardRef.current!.innerHTML =
                          "Copy to clipboard"),
                      2000
                    );
                  }}
                  ref={copyToClipboardRef}
                  className="btn"
                >
                  Copy to clipboard
                </button>
                <label htmlFor="invite" className="btn">
                  Ok
                </label>
              </div>
            </div>
          </div>
          <Link to="users">
            <button className="btn btn-info">Manage Users</button>
          </Link>
          {owner ? (
            <button
              onClick={() => {
                if (confirm) {
                  const formData = new FormData();
                  formData.append("option", "delete_team");
                  submit(formData, { method: "post" });
                } else {
                  setConfirm(true);
                  setTimeout(() => {
                    setConfirm(false);
                  }, 2000);
                }
              }}
              className="btn btn-error"
            >
              {confirm ? "Are you sure?" : "Delete Team"}
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm) {
                  const formData = new FormData();
                  formData.append("option", "leave_team");
                  submit(formData, { method: "post" });
                } else {
                  setConfirm(true);
                  setTimeout(() => {
                    setConfirm(false);
                  }, 2000);
                }
              }}
              className="btn btn-error"
            >
              {confirm ? "Are you sure?" : "Leave"}
            </button>
          )}
        </div>
      </div>
      <div className="flex h-full w-full flex-col 2xl:w-[800px]">
        <main className="w-full">
          <div className="h-full w-full p-3">
            <ul className="rounded-box h-full space-y-2 bg-base-100 p-2">
              <li>
                <label
                  htmlFor="new-bookmark"
                  className="flex cursor-pointer items-center justify-center py-2 font-semibold"
                >
                  <div className="flex gap-4">
                    <PlusCircleIcon width={20} /> New Bookmark
                  </div>
                </label>
                <input
                  type="checkbox"
                  id="new-bookmark"
                  className="modal-toggle"
                />
                <div className="modal">
                  <div className="modal-box">
                    <Form
                      method="post"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        width: "100%",
                      }}
                    >
                      <div className="p-5">
                        <label className="label">
                          <span className="label-text">Name</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Type here"
                          ref={nameRef}
                          name="name"
                          className={`input input-bordered w-full ${
                            actionData?.errors?.name && "input-error"
                          }`}
                          aria-invalid={
                            actionData?.errors?.name ? true : undefined
                          }
                          aria-errormessage={
                            actionData?.errors?.name ? "name-error" : undefined
                          }
                        />
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {actionData?.errors?.name}
                          </span>
                        </label>
                        <label className="label">
                          <span className="label-text">Link</span>
                        </label>
                        <input
                          className="hidden"
                          value="new_bookmark"
                          name="option"
                          type="text"
                          readOnly
                        />
                        <input
                          type="link"
                          placeholder="Type here"
                          ref={linkRef}
                          name="link"
                          className={`input input-bordered w-full ${
                            actionData?.errors?.link && "input-error"
                          }`}
                          aria-invalid={
                            actionData?.errors?.link ? true : undefined
                          }
                          aria-errormessage={
                            actionData?.errors?.link ? "name-error" : undefined
                          }
                        />
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {actionData?.errors?.link}
                          </span>
                        </label>
                      </div>
                      <div className="modal-action">
                        <button>
                          <label htmlFor="new-bookmark" className="btn">
                            Done
                          </label>
                        </button>
                        <button className="btn" type="submit">
                          Create
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </li>
              {data.bookmarks.map((team) => (
                <li key={team.id}>
                  <div className="rounded-box block space-y-1 bg-base-200 p-4">
                    <div className="flex items-center gap-4 text-lg font-semibold">
                      <div>📝 {team.name}</div>
                      <button
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("option", "bookmark");
                          formData.append("id", team.id);
                          submit(formData, { method: "post" });
                        }}
                        className="btn btn-error btn-circle btn-xs"
                      >
                        <XIcon height={16} className="text-white" />
                      </button>
                    </div>
                    <a
                      href={team.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-normal text-secondary"
                    >
                      {team.link}
                    </a>
                    <div className="text-xs">{team.createdBy.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
