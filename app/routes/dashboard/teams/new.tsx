import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLocation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import * as React from "react";

import type { Team } from "~/models/team.server";
import { createTeam, joinTeam } from "~/models/team.server";
import { requireUserId } from "~/session.server";
import logo from "~/branding/UN.png";
import Flow from "~/components/Flow";

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData.root.user
    ? {
        title: "New Team - Unified Bookmarks",
        description: "Create a new team",
        "twitter:card": "summary_large_image",
        "og:description": "Create a new team",
        "og:image": logo,
      }
    : {};
};

type ActionData = {
  errors?: {
    name?: string;
    join?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const join = formData.get("join");
  const option = formData.get("option");

  let teamId = "";

  if (option === "create") {
    if (typeof name !== "string" || name.length === 0) {
      return json<ActionData>(
        { errors: { name: "Name is required" } },
        { status: 400 }
      );
    }
    let team: Team;
    try {
      team = await createTeam({ name, userId });
    } catch {
      return json<ActionData>(
        { errors: { name: "Name already used" } },
        { status: 400 }
      );
    }
    teamId = team.id;
  } else {
    if (typeof join !== "string" || join.length === 0) {
      return json<ActionData>(
        { errors: { join: "Join is required" } },
        { status: 400 }
      );
    }
    let team: any;
    try {
      team = await joinTeam({ userId, code: join });
      if (!team) {
        return json<ActionData>(
          { errors: { join: "You are banned" } },
          { status: 400 }
        );
      }
    } catch {
      return json<ActionData>(
        { errors: { join: "Code is invalid" } },
        { status: 400 }
      );
    }

    teamId = team.id;
  }

  return redirect(`/dashboard/teams/${teamId}`);
};

export default function NewTeamPage() {
  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const joinRef = React.useRef<HTMLInputElement>(null);
  const submit = useSubmit();
  const params = useParams();

  React.useEffect(() => {
    if (params?.code) {
      const formData = new FormData();
      formData.append("option", "join");
      formData.append("join", params?.code);
      submit(formData, { method: "post", action: "/dashboard/teams/new" });
    }
  }, []);

  React.useEffect(() => {
    if (actionData?.errors?.name) nameRef.current?.focus();
    if (actionData?.errors?.join) joinRef.current?.focus();
  }, [actionData]);
  return (
    <>
      <Form
        method="post"
        action="/dashboard/teams/new"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div className="space-y-5 p-5">
          <h1 className="text-3xl font-black">Create Team</h1>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              className="hidden"
              value="create"
              name="option"
              type="text"
              readOnly
            />
            <input
              type="text"
              placeholder="Type here"
              ref={nameRef}
              name="name"
              className={`input input-bordered w-full max-w-xs ${
                actionData?.errors?.name && "input-error"
              }`}
              aria-invalid={actionData?.errors?.name ? true : undefined}
              aria-errormessage={
                actionData?.errors?.name ? "name-error" : undefined
              }
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {actionData?.errors?.name}
              </span>
            </label>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </div>
      </Form>
      <Form
        method="post"
        action="/dashboard/teams/new"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div className="space-y-5 p-5">
          <h1 className="text-3xl font-black">Someone invited you?</h1>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Invite Code</span>
            </label>
            <input
              readOnly
              className="hidden"
              value="join"
              name="option"
              type="text"
            />
            <input
              type="text"
              placeholder="Type here"
              ref={joinRef}
              name="join"
              className={`input input-bordered w-full max-w-xs ${
                actionData?.errors?.join && "input-error"
              }`}
              aria-invalid={actionData?.errors?.join ? true : undefined}
              aria-errormessage={
                actionData?.errors?.join ? "invite-error" : undefined
              }
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {actionData?.errors?.join}
              </span>
            </label>
            <button type="submit" className="btn btn-primary">
              Join
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
