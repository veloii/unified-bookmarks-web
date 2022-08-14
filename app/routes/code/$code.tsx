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
        title: "Join Team - Unified Bookmarks",
        description: "Join a new team",
        "twitter:card": "summary_large_image",
        "og:description": "Join a new team",
        "og:image": logo,
      }
    : {};
};

type ActionData = {
  errors?: {
    join?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(
    request,
    new URL(request.url).pathname.replace("$code", params.code!)
  );

  const formData = await request.formData();
  const join = formData.get("join");

  let teamId = "";

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

  return redirect(`/dashboard/teams/${teamId}`);
};

export default function NewTeamPage() {
  const actionData = useActionData() as ActionData;
  const submit = useSubmit();
  const params = useParams();

  React.useEffect(() => {
    if (params?.code) {
      const formData = new FormData();
      formData.append("option", "join");
      formData.append("join", params?.code);
      submit(formData, { method: "post" });
    }
  }, []);

  return <>{actionData?.errors?.join}</>;
}
