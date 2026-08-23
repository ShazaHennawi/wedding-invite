export const invitationConfig = {
  couple: {
    bride: "Shaza",
    groom: "Isaac",
    displayNames: "Isaac & Shaza",
  },
  wedding: {
    date: "17.10.2026",
    time: "[موعد الإكليل]",
    venue: "كنيسة القديس جاورجيوس",
  },
  arabicCeremony: {
    blessing: "إِذًا لَيْسَا بَعْدُ اثْنَيْنِ بَلْ جَسَدٌ وَاحِدٌ. فَالَّذِي جَمَعَهُ اللهُ لَا يُفَرِّقُهُ إِنْسَانٌ",
    groomFamily: "السيد سامر وسوف وعائلته",
    brideFamily: "السيد سامي حناوي وعائلته",
    invitation: "يتشرفان بدعوتكم لحضور إكليل ولديهما",
    groomName: "اسحق",
    brideName: "شذى",
    month: "تشرين الأول",
    day: "السبت",
    dateNumber: "17",
    year: "2026",
    closing: "فرحتنا تبدأ مع الرب وتكتمل بحضوركم",
    timelineHeading: "برنامج الزفاف",
    timeline: [
      { order: "01", icon: "church", label: "الإكليل", english: "Ceremony" },
      { order: "02", icon: "camera", label: "الصور", english: "Photos" },
      { order: "03", icon: "table", label: "الغداء", english: "Lunch" },
    ],
  },
  media: {
    type: "image" as "image" | "video",
    src: "/landing-couple-frame.png",
    poster: "/landing-couple-frame.png",
    alt: "Isaac and Shaza together",
    focalPosition: "center center",
  },
  copy: {
    invitation:
      "Together with our families, we invite you to celebrate our wedding.",
    openPrompt: "Tap to open",
  },
  music: {
    youtubeVideoId: "6W3-rHzCqkY",
    title: "Wedding music",
  },
} as const;

export type InvitationConfig = typeof invitationConfig;
