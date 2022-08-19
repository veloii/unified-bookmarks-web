import { LinkIcon } from "@heroicons/react/solid";
import { useSubmit } from "@remix-run/react";
import { useRef, useContext } from "react";
import toast from "react-hot-toast/headless";
import { ModalContext } from "~/contexts/ModalContext";

export default function InviteMemberModal() {
  const { modal } = useContext(ModalContext);
  const copyToClipboardRefCode = useRef<HTMLButtonElement>(null);
  const copyToClipboardRefLink = useRef<HTMLButtonElement>(null);
  const submit = useSubmit();

  const reset = () => {
    submit(
      {
        option: "reset_code",
      },
      {
        action: `/dashboard/teams/${modal?.team?.id}?index`,
        method: "post",
        replace: true,
      }
    );
  };

  const copyToClipboardCode = () => {
    navigator.clipboard.writeText(modal?.team?.code ?? "");
    toast("Copied to clipboard", { className: "alert-success" });
  };

  const copyToClipboardLink = () => {
    navigator.clipboard.writeText(
      `https://unifiedbookmarks.com/code/${modal?.team?.code}`
    );
    toast("Copied to clipboard", { className: "alert-success" });
  };

  return (
    <>
      <input type="checkbox" id="invite" className="modal-toggle" />
      <div className="modal backdrop-blur-lg">
        <div className="modal-box max-w-2xl">
          <h3 className="text-lg font-bold">Invite Member</h3>
          <div className="mt-4 flex items-center gap-2">
            <kbd className="kbd">{`${modal?.team?.code}`}</kbd>
            <button
              onClick={copyToClipboardCode}
              ref={copyToClipboardRefCode}
              className="btn btn-sm"
            >
              <LinkIcon height={16} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <kbd className="kbd">
              {`https://unifiedbookmarks.com/code/${modal?.team?.code}`}
            </kbd>
            <button
              onClick={copyToClipboardLink}
              ref={copyToClipboardRefLink}
              className="btn btn-sm"
            >
              <LinkIcon height={16} />
            </button>
          </div>

          <div className="modal-action">
            <button onClick={reset} className="btn">
              Reset
            </button>
            <label htmlFor="invite" className="btn">
              Ok
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
