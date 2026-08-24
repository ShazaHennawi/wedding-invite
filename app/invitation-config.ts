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
    gift: {
      message:
        "حضوركم هو الهدية الأجمل بالنسبة لنا؛ مع خالص الشكر والمحبة.",
      accounts: [
        { name: "Isaac Wassouf", iban: "DE11 1005 0000 1071 4190 79", bic: "BELADEBEXXX" },
        { name: "Hennawi, Shaza", iban: "DE53 1805 0000 1190 7117 25", bic: "WELADED1CBN" },
      ],
    },
  },
  media: {
    type: "image" as "image" | "video",
    src: "/landing-couple-frame-mirror.png",
    poster: "/landing-couple-frame-mirror.png",
    alt: "Isaac and Shaza together",
    focalPosition: "center center",
  },
  copy: {
    announcement: "We're Getting Married",
    invitation: "You’re Invited",
    openPrompt: "Tap to open",
  },
  music: {
    youtubeVideoId: "6W3-rHzCqkY",
    title: "Wedding music",
    volume: 22,
  },
} as const;

export type InvitationConfig = typeof invitationConfig;
