export const invitationConfig = {
  couple: {
    bride: "Shaza",
    groom: "Isaac",
    displayNames: "Isaac & Shaza",
  },
  wedding: {
    date: "17.10.2026",
    time: "[موعد الإكليل]",
    venue: "[اسم الكنيسة أو مكان الإكليل]",
    address: "[العنوان الكامل]",
    dressCode: "[اللباس]",
    message: "[رسالة شخصية]",
    mapUrl: "https://maps.google.com/",
  },
  arabicCeremony: {
    blessing: "رَتِّبْ يَا رَبُّ بَيْتَنَا بِالْمَجْدِ وَالْكَرَامَةِ، كَلِّلْهُمَا",
    groomFamily: "عائلة العريس",
    brideFamily: "عائلة العروس",
    invitation: "يتشرفان بدعوتكم لحضور إكليل ولديهما",
    groomName: "إسحاق",
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
