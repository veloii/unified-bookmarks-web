import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import Header from "~/components/Header";
import logo from "~/branding/UN.webp";

export const meta: MetaFunction = () => {
  return {
    title: "Login - Unified Bookmarks",
    "og:title": "Login - Unified Bookmarks",
    description: "Login to Unifed Bookmarks",

    "og:description": "Login to Unified Bookmarks",
    "og:image": logo,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/teams";
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="h-full bg-white">
      <Header />
      <div className="flex flex-col justify-center bg-white pt-36">
        <div className="mx-auto w-full max-w-md px-8">
          <Form method="post" noValidate>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email address</span>
              </label>
              <input
                type="email"
                required
                autoFocus
                name="email"
                ref={emailRef}
                placeholder="hello@unifiedbookmarks.com"
                className={`input input-bordered w-full bg-white ${
                  actionData?.errors?.email && "input-error"
                }`}
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.email ? "email-error" : undefined
                }
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {actionData?.errors?.email}
                  {"⠀"}
                </span>
              </label>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                name="password"
                ref={passwordRef}
                placeholder="hello@unifiedbookmarks.com"
                className={`input input-bordered w-full bg-white ${
                  actionData?.errors?.password && "input-error"
                }`}
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.password ? "password-error" : undefined
                }
              />
              <label className="label">
                <span className="label-text-alt text-error">
                  {actionData?.errors?.password}
                  {"⠀"}
                </span>
              </label>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              className="btn btn-primary w-full rounded-full"
            >
              Log in
            </button>
            <div className="flex items-center justify-between pt-5">
              <div className="flex items-center">
                <div className="form-control">
                  <label className="label cursor-pointer space-x-2">
                    <input
                      name="remember"
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text">Remember me</span>
                  </label>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  className="text-secondary underline"
                  to={{
                    pathname: "/join",
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
