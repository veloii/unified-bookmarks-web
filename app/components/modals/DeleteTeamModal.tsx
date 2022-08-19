import { useSubmit } from "@remix-run/react";
import { useContext, useRef } from "react";
import { ModalContext } from "~/contexts/ModalContext";
import { useUser } from "~/utils";

export default function DeleteTeamModal() {
  const submit = useSubmit();
  const { modal } = useContext(ModalContext);
  const closeRef = useRef<HTMLLabelElement>(null);
  const user = useUser();

  const action = () => {
    submit(
      {
        option: modal?.team?.ownerId === user.id ? "delete_team" : "leave_team",
      },
      { method: "post", action: `/dashboard/teams/${modal?.team?.id}?index` }
    );
    closeRef.current?.click();
  };

  return (
    <>
      <input type="checkbox" id="delete-team" className="modal-toggle" />
      <div className="modal backdrop-blur-lg">
        <div className="modal-box w-64">
          <h2 className="text-2xl font-bold">Are you sure?</h2>
          <div className="modal-action">
            <button onClick={action} className="btn btn-success flex-grow">
              Yes
            </button>
            <label
              ref={closeRef}
              htmlFor="delete-team"
              className="btn btn-error flex-grow"
            >
              No
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
