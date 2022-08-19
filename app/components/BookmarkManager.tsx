import { PlusCircleIcon, XIcon } from "@heroicons/react/solid";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import React, { useContext, useEffect } from "react";
import { ModalContext } from "~/contexts/ModalContext";
import type { getBookmarks } from "~/models/bookmarks.server";
import { action } from "~/routes/extapi";

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

  const { modal, setModal } = useContext(ModalContext);
  useEffect(() => {
    const copy = { ...modal };
    copy.createBookmarkActionData = actionData;
    setModal(copy);
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
  );
}
