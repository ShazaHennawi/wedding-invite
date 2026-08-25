import { WeddingInvitation } from "../page";

export const dynamic = "force-static";

export default function CeremonyInvitationPage() {
  return <WeddingInvitation showProgram={false} showRsvp rsvpBeforeGift />;
}
