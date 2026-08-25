export const invitationConfig = {
  couple: {
    bride: "Shaza",
    groom: "Isaac",
    displayNames: "Isaac & Shaza",
  },
  wedding: {
    date: "17.10.2026",
    time: "الثانية",
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
  englishCeremony: {
    blessing:
      "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
    groomFamily: "Mr. Samer Wassouf and Family",
    brideFamily: "Mr. Sami Hennawi and Family",
    invitation: "Are honored to invite you to the wedding ceremony of their children",
    groomName: "Isaac",
    brideName: "Shaza",
    time: "At two o’clock in the afternoon",
    date: "Saturday, 17 October 2026",
    closing: "Our joy begins with God and is made complete by your presence.",
    timelineHeading: "Wedding Program",
    gift: {
      heading: "GIFTS",
      message:
        "Your presence is the most beautiful gift to us. If you would like to celebrate with a gift, you may use the bank details provided, with our sincere thanks and love.",
      button: "DETAILS",
    },
    rsvp: {
      heading: "RSVP",
      message: "Reply to the invitation",
      button: "CONFIRM ATTENDANCE",
    },
  },
  media: {
    type: "image" as "image" | "video",
    src: "/landing-couple-frame-new.png",
    poster: "/landing-couple-frame-new.png",
    alt: "Isaac and Shaza together",
    focalPosition: "center center",
  },
  copy: {
    announcement: "We're Getting Married",
    invitation: "You’re Invited",
    openPrompt: "Tap to open",
  },
  music: {
    src: "/wedding-song.mp3",
    title: "Wedding music",
    volume: 17,
    startTime: 170,
    endTime: 194,
  },
} as const;

export type InvitationConfig = typeof invitationConfig;
