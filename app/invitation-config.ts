export const invitationConfig = {
  couple: {
    bride: "Shaza",
    groom: "Isaac",
    displayNames: "Isaac & Shaza",
  },
  wedding: {
    date: "17.10.2026",
    time: "[Ceremony Time]",
    venue: "[Venue Name]",
    address: "[Full Address]",
    dressCode: "[Dress Code]",
    message: "[Personal Message]",
    mapUrl: "https://maps.google.com/",
  },
  media: {
    type: "image" as "image" | "video",
    src: "/couple.jpg",
    poster: "/couple.jpg",
    alt: "Isaac and Shaza on their wedding day",
    focalPosition: "center center",
  },
  copy: {
    invitation:
      "Together with our families, we invite you to celebrate our wedding.",
    openPrompt: "Tap to open",
  },
} as const;

export type InvitationConfig = typeof invitationConfig;
