import DeleteAccountModal from "~/components/modals/DeleteAccountModal";
import PasswordChangeModal from "~/components/modals/PasswordChangeModal";
import DeleteTeamModal from "./DeleteTeamModal";
import InviteMemberModal from "./InviteMemberModal";
import NewBookmarkModal from "./NewBookmarkModal";

export function Modals() {
  return (
    <>
      <PasswordChangeModal />
      <DeleteAccountModal />
      <InviteMemberModal />
      <NewBookmarkModal />
      <DeleteTeamModal />
    </>
  );
}
