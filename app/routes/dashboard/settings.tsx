import { Form, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction, MetaFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import React, { useContext, useEffect, useState } from "react";
import invariant from "tiny-invariant";
import {
  deleteUser,
  editPassword,
  getUserById,
  verifyLogin,
} from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import logo from "~/branding/UN.webp";
import ThemePicker from "~/components/ThemePicker";
import { ModalContext } from "~/contexts/ModalContext";

type ActionData = {
  errors?: {
    oldPass?: string;
    newPass?: string;
  };
  success?: {
    password?: boolean;
    account?: boolean;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const option = formData.get("option");

  if (option === "password") {
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
    return json<ActionData>({ success: { password: true } });
  }
  if (option === "delete_account") {
    const deletion = await deleteUser(userId);
    invariant(deletion, "Could not delete account");
    return json<ActionData>({ success: { account: true } });
  }

  return null;
};

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData.root.user
    ? {
        title: "Settings - Unified Bookmarks",
        description: "Change your settings",

        "og:description": "Change your settings",
        "og:image": logo,
        "og:title": logo,
      }
    : {};
};

export default function Settings() {
  const user = useUser();
  const actionData = useActionData() as ActionData;
  const { setModal, modal } = useContext(ModalContext);
  useEffect(() => {
    const copy = { ...modal };
    copy.passwordActionData = actionData;
    setModal(copy);
  }, [actionData]);

  return (
    <>
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

          <div className="space-x-2">
            <label
              htmlFor="password-change"
              className="modal-button btn btn-info"
            >
              Change password
            </label>
            <label
              htmlFor="delete-account"
              className="modal-button btn btn-error"
            >
              Delete account
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
