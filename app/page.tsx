"use client";

export const dynamic = "force-static";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { assetPath } from "./asset-path";
import { invitationConfig as invitation } from "./invitation-config";

type ExperienceState = "closed" | "details";
type InvitationLanguage = "ar" | "en";
type TimelineItem = (typeof invitation.arabicCeremony.timeline)[number];
type MusicController = {
  play: () => void;
  pause: () => void;
};
const RETURN_VIEW_KEY = "wedding-invitation-return-view";
const RETURN_SCROLL_KEY = "wedding-invitation-return-scroll";
const LANGUAGE_KEY = "wedding-invitation-language";

function CoupleMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (invitation.media.type !== "video" || !videoRef.current) return;
    const playback = videoRef.current.play();
    if (playback) playback.catch(() => setShowFallback(true));
  }, []);

  if (invitation.media.type === "video" && !showFallback) {
    return (
      <video
        ref={videoRef}
        className="media-fill"
        src={assetPath(invitation.media.src)}
        poster={assetPath(invitation.media.poster)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setShowFallback(true)}
        aria-label={invitation.media.alt}
        style={{ objectPosition: invitation.media.focalPosition }}
      />
    );
  }

  return (
    <Image
      src={assetPath(invitation.media.type === "video" ? invitation.media.poster : invitation.media.src)}
      alt={invitation.media.alt}
      width={1620}
      height={2025}
      priority
      sizes="(max-width: 480px) 100vw, 430px"
      className="landing-image"
      style={{ objectPosition: invitation.media.focalPosition }}
    />
  );
}

function Envelope() {
  return (
    <span className="envelope" aria-hidden="true">
      <span className="whole-envelope-art">
        <Image
          src={assetPath("/envelope-whole.png")}
          alt=""
          width={1366}
          height={1708}
          sizes="(max-width: 480px) 92vw, 360px"
          className="whole-envelope-image"
          aria-hidden="true"
          draggable={false}
        />
      </span>
    </span>
  );
}

const CeremonyMusic = forwardRef<MusicController, { onStop: () => void }>(function CeremonyMusic(
  { onStop },
  ref,
) {
  const playerRef = useRef<HTMLAudioElement>(null);

  const preparePlayback = () => {
    const player = playerRef.current;
    if (!player) return;

    player.volume = invitation.music.volume / 100;
    if (
      player.currentTime < invitation.music.startTime ||
      player.currentTime >= invitation.music.endTime
    ) {
      player.currentTime = invitation.music.startTime;
    }
  };

  useImperativeHandle(ref, () => ({
    play: () => {
      const player = playerRef.current;
      if (!player) return;
      preparePlayback();
      void player.play();
    },
    pause: () => playerRef.current?.pause(),
  }));

  const stopAtEnd = () => {
    const player = playerRef.current;
    if (!player || player.currentTime < invitation.music.endTime) return;

    player.pause();
    player.currentTime = invitation.music.endTime;
    onStop();
  };

  return (
    <audio
      ref={playerRef}
      className="ceremony-music"
      src={assetPath(invitation.music.src)}
      title={invitation.music.title}
      preload="metadata"
      aria-hidden="true"
      onLoadedMetadata={preparePlayback}
      onTimeUpdate={stopAtEnd}
    />
  );
});

function Landing({ onOpen }: { onOpen: () => void }) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.main
      key="landing"
      className="invitation-shell min-h-[100svh] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.48 }}
    >
      <article className="landing-card mx-auto flex w-full max-w-[430px] flex-col items-center pb-6 text-center">
        <p className="wedding-announcement">{invitation.copy.announcement}</p>

        <figure className="landing-art">
          <CoupleMedia />
        </figure>

        <h1 className="invitation-copy">{invitation.copy.invitation}</h1>

        <motion.button
          className="envelope-button mt-3"
          type="button"
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen();
            }
          }}
          aria-label="Open the wedding invitation"
          whileHover={reducedMotion ? undefined : { y: -3 }}
          whileTap={reducedMotion ? undefined : { scale: 0.965, y: 2 }}
        >
          <Envelope />
        </motion.button>
        <p className="tap-prompt">{invitation.copy.openPrompt}</p>
      </article>
    </motion.main>
  );
}

function TimelineStep({
  item,
  index,
  progress,
  reducedMotion,
  language,
}: {
  item: TimelineItem;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  language: InvitationLanguage;
}) {
  const revealAt = index * 0.36;
  const opacity = useTransform(progress, [revealAt - 0.04, revealAt + 0.04], [0.12, 1]);
  const y = useTransform(progress, [revealAt - 0.04, revealAt + 0.04], [20, 0]);
  const iconScale = useTransform(progress, [revealAt - 0.03, revealAt, revealAt + 0.05], [0.58, 1.18, 1]);
  const iconRotate = useTransform(progress, [revealAt - 0.03, revealAt + 0.05], [-4, 0]);

  return (
    <motion.li style={reducedMotion ? undefined : { opacity, y }}>
      <span className="timeline-node" aria-hidden="true" />
      <span className="timeline-step-content">
        <motion.span
          className={`timeline-icon timeline-icon-${item.icon}`}
          aria-hidden="true"
          style={reducedMotion ? undefined : { scale: iconScale, rotate: iconRotate }}
        />
        <span className="timeline-copy">
          <span className="timeline-label">{language === "en" ? item.english : item.label}</span>
          {language === "ar" ? (
            <span className="timeline-label-en" dir="ltr" lang="en">{item.english}</span>
          ) : null}
        </span>
      </span>
    </motion.li>
  );
}

function CeremonyDetails({
  onOpenGift,
  language,
}: {
  onOpenGift: () => void;
  language: InvitationLanguage;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineSectionRef = useRef<HTMLElement>(null);
  const arabic = invitation.arabicCeremony;
  const english = invitation.englishCeremony;
  const isEnglish = language === "en";
  const blessingWords = arabic.blessing.split(" ");
  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineSectionRef,
    offset: ["start 100%", "end 100%"],
  });
  const acceleratedTimelineProgress = useTransform(timelineScrollProgress, [0, 0.58], [0, 1], { clamp: true });
  const timelineProgress = useSpring(acceleratedTimelineProgress, {
    stiffness: 360,
    damping: 30,
    mass: 0.12,
  });

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.main
      key="details"
      className="details-shell min-h-[100svh] w-full px-3 py-4 sm:px-6 sm:py-10"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.25 : 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <article
        className={`paper-frame detail-card arabic-invitation mx-auto w-full text-center${isEnglish ? " english-invitation" : ""}`}
        dir={isEnglish ? "ltr" : "rtl"}
        lang={language}
      >
        <div className="ceremony-content">
          <p
            className={`arabic-blessing${isEnglish ? " english-blessing" : ""}`}
            aria-label={isEnglish ? english.blessing : arabic.blessing}
          >
            {isEnglish
              ? english.blessing
              : blessingWords.map((word, index) => (
                  <span className="blessing-arc-word" aria-hidden="true" key={`${word}-${index}`}>
                    {word}
                  </span>
                ))}
          </p>

          <span className="blessing-cross" aria-hidden="true">
            <Image
              src={assetPath("/bible-cross-cutout.png")}
              alt=""
              width={1024}
              height={1536}
              sizes="52px"
              className="blessing-cross-image"
              draggable={false}
            />
          </span>

          <div className="arabic-families">
            <span>{isEnglish ? english.groomFamily : arabic.groomFamily}</span>
            <span>{isEnglish ? english.brideFamily : arabic.brideFamily}</span>
          </div>

          <p className="arabic-invitation-line">{isEnglish ? english.invitation : arabic.invitation}</p>

          <h1 ref={headingRef} tabIndex={-1} className="arabic-couple-names">
            <span>{isEnglish ? english.groomName : arabic.groomName}</span>
            <span className="names-amp" aria-hidden="true">&amp;</span>
            <span>{isEnglish ? english.brideName : arabic.brideName}</span>
          </h1>

          <section
            className="ceremony-summary"
            aria-label={isEnglish ? `Wedding ceremony ${invitation.wedding.date}` : `موعد الإكليل ${invitation.wedding.date}`}
          >
            {isEnglish ? (
              <>
                <p>{english.time}</p>
                <p>{english.date}</p>
                <p className="ceremony-venue">{english.venue}</p>
              </>
            ) : (
              <>
                <p>وذلك في تمام الساعة {invitation.wedding.time}</p>
                <p>
                  مساء يوم {arabic.day} الموافق <strong>{arabic.dateNumber}</strong> {arabic.month}{" "}
                  <strong>{arabic.year}</strong>
                </p>
                <p className="ceremony-venue">{arabic.venue}</p>
              </>
            )}
          </section>

          <p className="arabic-closing">{isEnglish ? english.closing : arabic.closing}</p>
        </div>
      </article>

      <article
        ref={timelineSectionRef}
        className={`supporting-card timeline-card w-full text-center${isEnglish ? " english-timeline" : ""}`}
        dir={isEnglish ? "ltr" : "rtl"}
        lang={language}
      >
        <section className="supporting-card-content timeline-card-content" aria-labelledby="timeline-heading">
          <div className="timeline-ornament" aria-hidden="true">
            <Image
              src={assetPath("/wedding-program-ornament-transparent.png")}
              alt=""
              width={2172}
              height={724}
              sizes="240px"
              className="timeline-ornament-image"
              draggable={false}
            />
          </div>
          <h2 id="timeline-heading">{isEnglish ? english.timelineHeading : arabic.timelineHeading}</h2>
          <ol className="wedding-timeline" aria-label={isEnglish ? english.timelineHeading : arabic.timelineHeading}>
            <motion.span
              className="timeline-progress"
              aria-hidden="true"
              style={{ scaleY: reducedMotion ? 1 : timelineProgress }}
            />
            {arabic.timeline.map((item, index) => (
              <TimelineStep
                key={item.order}
                item={item}
                index={index}
                progress={timelineProgress}
                reducedMotion={reducedMotion}
                language={language}
              />
            ))}
          </ol>
        </section>
      </article>

      <article
        className="supporting-card gift-card gift-card-cover w-full text-center"
        dir={isEnglish ? "ltr" : "rtl"}
        lang={language}
      >
        <div className={`gift-cover-art${isEnglish ? " translated-gift-card" : ""}`}>
          {isEnglish ? (
            <div className="translated-card-content">
              <h2>{english.gift.heading}</h2>
              <span className="translated-card-ornament" aria-hidden="true">✦</span>
              <p>{english.gift.message}</p>
              <a
                className="translated-card-button"
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/bank-details.html`}
                onClick={onOpenGift}
              >
                <span aria-hidden="true">＋</span>
                {english.gift.button}
                <span aria-hidden="true">＋</span>
              </a>
            </div>
          ) : (
            <>
              <Image
                src={assetPath("/gift-cover-card-arabic-details.png")}
                alt="Gift details cover"
                width={1480}
                height={1480}
                sizes="(max-width: 430px) 100vw, 430px"
                className="gift-cover-image"
                draggable={false}
              />
              <a
                className="gift-cover-button"
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/bank-details.html`}
                onClick={onOpenGift}
                aria-label="التفاصيل"
              >
                <span className="sr-only">التفاصيل</span>
              </a>
            </>
          )}
        </div>
      </article>

      <article className="supporting-card rsvp-card w-full text-center" lang={language}>
        <div className={`rsvp-card-art${isEnglish ? " translated-rsvp-card" : ""}`}>
          {isEnglish ? (
            <div className="translated-card-content">
              <p className="translated-rsvp-kicker">{english.rsvp.message}</p>
              <h2>{english.rsvp.heading}</h2>
              <span className="translated-card-ornament" aria-hidden="true">✦</span>
              <a
                className="translated-card-button"
                href="https://docs.google.com/forms/d/e/1FAIpQLSe2EGqsYW_jGXh6ofT957yQLLdh44orRyo9310oWnLksTYVWg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span aria-hidden="true">＋</span>
                {english.rsvp.button}
                <span aria-hidden="true">＋</span>
              </a>
            </div>
          ) : (
            <>
              <Image
                src={assetPath("/rsvp-confirm-attendance-final.png")}
                alt="الردّ على الدعوة — تأكيد الحضور"
                width={1536}
                height={1024}
                sizes="(max-width: 430px) 100vw, 430px"
                className="rsvp-card-image"
                draggable={false}
              />
              <a
                className="rsvp-card-button"
                href="https://docs.google.com/forms/d/e/1FAIpQLSe2EGqsYW_jGXh6ofT957yQLLdh44orRyo9310oWnLksTYVWg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تأكيد الحضور"
              >
                <span className="sr-only">تأكيد الحضور</span>
              </a>
            </>
          )}
        </div>
      </article>

    </motion.main>
  );
}

export default function Home() {
  const [state, setState] = useState<ExperienceState>("closed");
  const [language, setLanguage] = useState<InvitationLanguage>("ar");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [returnScroll, setReturnScroll] = useState<number | null>(null);
  const musicRef = useRef<MusicController>(null);

  useEffect(() => {
    const savedLanguage = window.sessionStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === "ar" || savedLanguage === "en") setLanguage(savedLanguage);

    if (window.sessionStorage.getItem(RETURN_VIEW_KEY) !== "details") return;

    const savedScroll = Number(window.sessionStorage.getItem(RETURN_SCROLL_KEY));
    window.sessionStorage.removeItem(RETURN_VIEW_KEY);
    window.sessionStorage.removeItem(RETURN_SCROLL_KEY);
    setReturnScroll(Number.isFinite(savedScroll) ? savedScroll : 0);
    setState("details");
  }, []);

  useEffect(() => {
    if (state !== "details") return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, state]);

  useEffect(() => {
    if (state !== "details" || returnScroll === null) return;

    const restore = window.setTimeout(() => {
      window.scrollTo({ top: returnScroll, behavior: "auto" });
      setReturnScroll(null);
    }, 80);

    return () => window.clearTimeout(restore);
  }, [returnScroll, state]);

  const openInvitation = () => {
    if (state !== "closed") return;
    musicRef.current?.play();
    setMusicPlaying(true);
    setState("details");
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      musicRef.current?.pause();
    } else {
      musicRef.current?.play();
    }
    setMusicPlaying((playing) => !playing);
  };

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === "ar" ? "en" : "ar";
      window.sessionStorage.setItem(LANGUAGE_KEY, next);
      return next;
    });
  };

  const rememberInvitationPosition = () => {
    window.sessionStorage.setItem(RETURN_VIEW_KEY, "details");
    window.sessionStorage.setItem(RETURN_SCROLL_KEY, String(window.scrollY));
  };

  return (
    <>
      <CeremonyMusic ref={musicRef} onStop={() => setMusicPlaying(false)} />
      <AnimatePresence mode="wait">
        {state === "details" ? (
          <CeremonyDetails onOpenGift={rememberInvitationPosition} language={language} />
        ) : (
          <Landing onOpen={openInvitation} />
        )}
      </AnimatePresence>
      {state === "details" ? (
        <>
          <button
            className="language-toggle"
            type="button"
            onClick={toggleLanguage}
            aria-label={language === "ar" ? "Translate invitation to English" : "ترجمة الدعوة إلى العربية"}
            lang={language === "ar" ? "en" : "ar"}
            dir={language === "ar" ? "ltr" : "rtl"}
          >
            <span className="language-toggle-icon" aria-hidden="true">A</span>
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </button>
          <button
            className={`music-toggle${musicPlaying ? " is-playing" : ""}`}
            type="button"
            onClick={toggleMusic}
            aria-pressed={musicPlaying}
            aria-label={
              language === "en"
                ? musicPlaying ? "Pause music" : "Play music"
                : musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"
            }
            dir={language === "en" ? "ltr" : "rtl"}
          >
            <span className="music-toggle-icon" aria-hidden="true">♪</span>
            <span>
              {language === "en"
                ? musicPlaying ? "Pause music" : "Play music"
                : musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
            </span>
          </button>
        </>
      ) : null}
    </>
  );
}
