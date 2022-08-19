import DeleteAccountModal from "~/components/modals/DeleteAccountModal";
import PasswordChangeModal from "~/components/modals/PasswordChangeModal";
import InviteMemberModal from "./InviteMemberModal";

export function Modals() {
  return (
    <>
      <PasswordChangeModal />
      <DeleteAccountModal />
    </>
  );
}

export function TeamModals() {
  return (
    <>
      <InviteMemberModal />
    </>
  );
}
