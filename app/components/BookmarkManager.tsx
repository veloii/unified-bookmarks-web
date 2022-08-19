import { PlusCircleIcon, XIcon } from "@heroicons/react/solid";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import React from "react";
import type { getBookmarks } from "~/models/bookmarks.server";

type CreateBookmarkActionData = {
  errors?: {
    name?: string;
    link?: string;
  };
};

type LoaderData = {
  bookmarks: NonNullable<Awaited<ReturnType<typeof getBookmarks>>>;
};

export default function BookmarkManager({ bookmarks }: LoaderData) {
  const submit = useSubmit();
  const actionData = useActionData() as CreateBookmarkActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) nameRef.current?.focus();
    if (actionData?.errors?.link) linkRef.current?.focus();
  }, [actionData]);

  return (
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
            <input type="checkbox" id="new-bookmark" className="modal-toggle" />
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
                      aria-invalid={actionData?.errors?.link ? true : undefined}
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
          {bookmarks.map((team) => (
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
                    className="btn btn-circle btn-error btn-xs"
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
  );
}
