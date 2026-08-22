export const invitationConfig = {
  couple: {
    bride: "Shaza",
    groom: "Isaac",
    displayNames: "Isaac & Shaza",
  },
  wedding: {
    date: "17.10.2026",
    time: "[موعد الإكليل]",
    venue: "القديس جاورجيوس",
  },
  arabicCeremony: {
    blessing: "«أيها الرب إلهنا بالمجد والكرامة كلّلهما»",
    groomFamily: "سامر وسوف وعائلته",
    brideFamily: "سامي حناوي وعائلته",
    invitation: "يتشرفان بدعوتكم لحضور إكليل ولديهما",
    groomName: "اسحق",
    brideName: "شذى",
    month: "تشرين الأول",
    day: "السبت",
    dateNumber: "17",
    year: "2026",
    closing: "فرحتنا تبدأ مع الرب وتكتمل بحضوركم",
    congratulations: "تُقبل التهاني في الكنيسة",
  },
  media: {
    type: "image" as "image" | "video",
    src: "/landing-portrait-art.png",
    poster: "/landing-portrait-art.png",
    alt: "Elegant embossed bridal portrait artwork",
    focalPosition: "center center",
  },
  copy: {
    invitation:
      "Together with our families, we invite you to celebrate our wedding.",
    openPrompt: "Tap to open",
  },
} as const;

export type InvitationConfig = typeof invitationConfig;
