import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import React, { useContext } from "react";
import { toast } from "react-hot-toast/headless";
import { ModalContext } from "~/contexts/ModalContext";

export default function PasswordChangeModal() {
  const { modal } = useContext(ModalContext);
  const oldPassRef = React.useRef<HTMLInputElement>(null);
  const newPassRef = React.useRef<HTMLInputElement>(null);
  const backRef = React.useRef<HTMLLabelElement>(null);

  React.useEffect(() => {
    if (modal?.passwordActionData?.success?.password) {
      backRef.current!.click();
      toast("Password successfully updated", { className: "alert-success" });
      oldPassRef.current!.value = "";
      newPassRef.current!.value = "";
    }
    if (modal?.passwordActionData?.errors?.oldPass) oldPassRef.current?.focus();
    if (modal?.passwordActionData?.errors?.newPass) newPassRef.current?.focus();
  }, [modal?.passwordActionData]);

  return (
    <>
      <input type="checkbox" id="password-change" className="modal-toggle" />
      <div className="modal backdrop-blur-lg">
        <div className="modal-box">
          <Form action="/dashboard/settings" method="post">
            <div className="flex w-full flex-col items-center ">
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
                    modal?.passwordActionData?.errors?.oldPass && "input-error"
                  }`}
                  aria-invalid={
                    modal?.passwordActionData?.errors?.oldPass
                      ? true
                      : undefined
                  }
                  aria-errormessage={
                    modal?.passwordActionData?.errors?.oldPass
                      ? "oldPass-error"
                      : undefined
                  }
                />
                <label className="label">
                  <span className="label-text-alt text-error">
                    {modal?.passwordActionData?.errors?.oldPass}
                    {"⠀"}
                  </span>
                </label>
              </div>
              <input
                className="hidden"
                value="password"
                name="option"
                type="text"
                readOnly
              />
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
                    modal?.passwordActionData?.errors?.newPass && "input-error"
                  }`}
                  aria-invalid={
                    modal?.passwordActionData?.errors?.newPass
                      ? true
                      : undefined
                  }
                  aria-errormessage={
                    modal?.passwordActionData?.errors?.newPass
                      ? "newPass-error"
                      : undefined
                  }
                />
                <label className="label">
                  <span className="label-text-alt text-error">
                    {modal?.passwordActionData?.errors?.newPass}
                    {"⠀"}
                  </span>
                </label>
              </div>
            </div>
            <div className=" w-full">
              <div className="flex justify-between">
                <label ref={backRef} htmlFor="password-change" className="btn">
                  <ArrowLeftIcon height={16} />
                </label>
                <button type="submit" className="btn btn-primary">
                  Change
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
