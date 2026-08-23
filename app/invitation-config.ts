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
    giftHeading: "هديّة",
    giftMessage:
      "حضوركم هو الهدية الأجمل بالنسبة لنا؛ وإن أحببتم مشاركة فرحتنا بهدية، يمكنكم ذلك عبر الحسابات البنكية التالية، مع خالص الشكر والمحبة.",
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
