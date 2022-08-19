import { useSubmit } from "@remix-run/react";

export default function DeleteAccountModal() {
  const submit = useSubmit();

  const deleteAccount = () =>
    submit(
      { option: "delete_account" },
      { method: "post", action: "/dashboard/settings" }
    );

  return (
    <>
      <input type="checkbox" id="delete-account" className="modal-toggle" />
      <div className="modal backdrop-blur-lg">
        <div className="modal-box w-64">
          <h2 className="text-2xl font-bold">Are you sure?</h2>
          <div className="modal-action">
            <button
              onClick={deleteAccount}
              className="btn btn-success flex-grow"
            >
              Yes
            </button>
            <label htmlFor="delete-account" className="btn btn-error flex-grow">
              No
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
