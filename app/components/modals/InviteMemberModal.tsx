import { useState, useRef } from "react";
import { useTeam } from "~/utils";

export default function InviteMemberModal() {
  const team = useTeam();
  const copyToClipboardRefCode = useRef<HTMLButtonElement>(null);
  const copyToClipboardRefLink = useRef<HTMLButtonElement>(null);

  const copyToClipboardCode = () => {
    navigator.clipboard.writeText(team.code);
    copyToClipboardRefCode.current!.innerText = "Copied!";
    setTimeout(
      () => (copyToClipboardRefCode.current!.innerHTML = "Copy to clipboard"),
      2000
    );
  };

  const copyToClipboardLink = () => {
    navigator.clipboard.writeText(
      `https://unifiedbookmarks.com/code/${team.code}`
    );
    copyToClipboardRefLink.current!.innerText = "Copied!";
    setTimeout(
      () => (copyToClipboardRefLink.current!.innerHTML = "Copy to clipboard"),
      2000
    );
  };

  return (
    <>
      <input type="checkbox" id="invite" className="modal-toggle" />
      <div className="modal backdrop-blur-lg">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Invite Member</h3>
          <kbd className="kbd mt-4">{`${team.code}`}</kbd>
          <button
            onClick={copyToClipboardCode}
            ref={copyToClipboardRefCode}
            className="btn"
          >
            Copy to clipboard
          </button>
          <kbd className="kbd mt-4">
            {`https://unifiedbookmarks.com/code/${team.code}`}
          </kbd>
          <button
            onClick={copyToClipboardLink}
            ref={copyToClipboardRefLink}
            className="btn"
          >
            Copy to clipboard
          </button>

          <div className="modal-action">
            <button className="btn">Reset</button>
            <label htmlFor="invite" className="btn">
              Ok
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
