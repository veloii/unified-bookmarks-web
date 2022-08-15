import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, MetaFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import React, { useState } from "react";
import invariant from "tiny-invariant";
import { editPassword, getUserById, verifyLogin } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import logo from "~/branding/UN.png";
import ThemePicker from "~/components/ThemePicker";

type ActionData = {
  errors?: {
    oldPass?: string;
    newPass?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const oldPass = formData.get("oldPass");
  const newPass = formData.get("newPass");
  if (typeof oldPass !== "string" || oldPass.length === 0) {
    return json<ActionData>(
      { errors: { oldPass: "Old Password is required" } },
      { status: 400 }
    );
  }

  if (typeof newPass !== "string" || newPass.length === 0) {
    return json<ActionData>(
      { errors: { newPass: "New Password is required" } },
      { status: 400 }
    );
  }

  if (newPass.length < 8) {
    return json<ActionData>(
      { errors: { oldPass: "New Password is too short" } },
      { status: 400 }
    );
  }

  const userEmail = (await getUserById(userId))?.email;
  invariant(userEmail, "Cannot find user");
  const oldPassVerify = await verifyLogin(userEmail, oldPass);
  if (!oldPassVerify)
    return json<ActionData>(
      { errors: { oldPass: "Old password does not match" } },
      { status: 400 }
    );
  const edit = await editPassword(userId, newPass.toString());
  invariant(edit, "Could not edit password");

  return null;
};

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData.root.user
    ? {
        title: "Settings - Unified Bookmarks",
        description: "Change your settings",
        "twitter:card": "summary_large_image",
        "og:description": "Change your settings",
        "og:image": logo,
      }
    : {};
};

export default function Settings() {
  const user = useUser();
  const actionData = useActionData() as ActionData;
  const [toast, setToast] = useState(false);

  const oldPassRef = React.useRef<HTMLInputElement>(null);
  const newPassRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData === null) {
      setToast(true);
      oldPassRef.current!.value = "";
      newPassRef.current!.value = "";
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }
    if (actionData?.errors?.oldPass) oldPassRef.current?.focus();
    if (actionData?.errors?.newPass) newPassRef.current?.focus();
  }, [actionData]);

  return (
    <>
      {" "}
      {toast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <div>
              <span>Password successfully updated</span>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2 p-5">
        <div>
          <h1 className="text-3xl font-black">Settings</h1>
        </div>
        <div className="space-y-10">
          <p className="text-lg">
            You are logged in as:{" "}
            <span className="font-semibold">{user.email}</span>
          </p>
          <ThemePicker />
          <Form method="post">
            <div className="flex w-full flex-col items-center gap-5 md:flex-row">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Old Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Type here"
                  ref={oldPassRef}
                  name="oldPass"
                  className={`input input-bordered w-full ${
                    actionData?.errors?.oldPass && "input-error"
                  }`}
                  aria-invalid={actionData?.errors?.oldPass ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.oldPass ? "oldPass-error" : undefined
                  }
                />
                <label className="label">
                  <span className="label-text-alt text-error">
                    {actionData?.errors?.oldPass}
                    {"⠀"}
                  </span>
                </label>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Type here"
                  ref={newPassRef}
                  name="newPass"
                  className={`input input-bordered w-full ${
                    actionData?.errors?.newPass && "input-error"
                  }`}
                  aria-invalid={actionData?.errors?.newPass ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.newPass ? "newPass-error" : undefined
                  }
                />
                <label className="label">
                  <span className="label-text-alt text-error">
                    {actionData?.errors?.newPass}
                    {"⠀"}
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto"
              >
                Change
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
