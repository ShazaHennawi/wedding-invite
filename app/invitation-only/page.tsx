import { WeddingInvitation } from "../page";

export const dynamic = "force-static";

export default function InvitationOnlyPage() {
  return <WeddingInvitation showProgram={false} showRsvp={false} />;
}
