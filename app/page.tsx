"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { invitationConfig as invitation } from "./invitation-config";

type ExperienceState = "closed" | "details";
type TimelineItem = (typeof invitation.arabicCeremony.timeline)[number];
type MusicController = {
  play: () => void;
  pause: () => void;
};

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
        src={invitation.media.src}
        poster={invitation.media.poster}
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
      src={invitation.media.type === "video" ? invitation.media.poster : invitation.media.src}
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
          src="/envelope-whole.png"
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

const CeremonyMusic = forwardRef<MusicController>(function CeremonyMusic(_, ref) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const sendCommand = (func: string, args: Array<number> = []) => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com",
    );
  };

  useImperativeHandle(ref, () => ({
    play: () => {
      sendCommand("setVolume", [invitation.music.volume]);
      sendCommand("playVideo");
    },
    pause: () => sendCommand("pauseVideo"),
  }));

  const videoId = invitation.music.youtubeVideoId;
  const source = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&loop=1&playlist=${videoId}&start=${invitation.music.startTime}&end=${invitation.music.endTime}&playsinline=1&rel=0&modestbranding=1&controls=0&enablejsapi=1`;

  return (
    <iframe
      ref={playerRef}
      className="ceremony-music"
      src={source}
      title={invitation.music.title}
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-hidden="true"
      tabIndex={-1}
      onLoad={() => sendCommand("setVolume", [invitation.music.volume])}
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
}: {
  item: TimelineItem;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
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
          <span className="timeline-label">{item.label}</span>
          <span className="timeline-label-en" dir="ltr" lang="en">{item.english}</span>
        </span>
      </span>
    </motion.li>
  );
}

function CeremonyDetails() {
  const reducedMotion = Boolean(useReducedMotion());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineSectionRef = useRef<HTMLElement>(null);
  const arabic = invitation.arabicCeremony;
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
        className="paper-frame detail-card arabic-invitation mx-auto w-full text-center"
        dir="rtl"
        lang="ar"
      >
        <div className="ceremony-content">
          <p className="arabic-blessing" aria-label={arabic.blessing}>
            {blessingWords.map((word, index) => (
              <span className="blessing-arc-word" aria-hidden="true" key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </p>

          <span className="blessing-cross" aria-hidden="true">
            <Image
              src="/bible-cross-cutout.png"
              alt=""
              width={1024}
              height={1536}
              sizes="52px"
              className="blessing-cross-image"
              draggable={false}
            />
          </span>

          <div className="arabic-families">
            <span>{arabic.groomFamily}</span>
            <span>{arabic.brideFamily}</span>
          </div>

          <p className="arabic-invitation-line">{arabic.invitation}</p>

          <h1 ref={headingRef} tabIndex={-1} className="arabic-couple-names">
            <span>{arabic.groomName}</span>
            <span className="names-amp" aria-hidden="true">&amp;</span>
            <span>{arabic.brideName}</span>
          </h1>

          <section className="ceremony-summary" aria-label={`موعد الإكليل ${invitation.wedding.date}`}>
            <p>وذلك في تمام الساعة {invitation.wedding.time}</p>
            <p>
              مساء يوم {arabic.day} الموافق <strong>{arabic.dateNumber}</strong> {arabic.month}{" "}
              <strong>{arabic.year}</strong>
            </p>
          </section>

          <p className="arabic-closing">{arabic.closing}</p>
        </div>
      </article>

      <article ref={timelineSectionRef} className="supporting-card timeline-card w-full text-center" dir="rtl" lang="ar">
        <section className="supporting-card-content timeline-card-content" aria-labelledby="timeline-heading">
          <div className="timeline-ornament" aria-hidden="true">
            <Image
              src="/wedding-program-ornament-transparent.png"
              alt=""
              width={2172}
              height={724}
              sizes="240px"
              className="timeline-ornament-image"
              draggable={false}
            />
          </div>
          <h2 id="timeline-heading">{arabic.timelineHeading}</h2>
          <ol className="wedding-timeline" aria-label={arabic.timelineHeading}>
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
              />
            ))}
          </ol>
        </section>
      </article>

      <article
        className="supporting-card gift-card gift-card-cover w-full text-center"
        dir="rtl"
        lang="ar"
      >
        <div className="gift-cover-art">
              <Image
                src="/gift-cover-card-arabic-details.png"
                alt="Gift details cover"
                width={1480}
                height={1480}
                sizes="(max-width: 430px) 100vw, 430px"
                className="gift-cover-image"
                draggable={false}
              />
              <a
                className="gift-cover-button"
                href="/bank-details"
                aria-label="التفاصيل"
              >
                <span className="sr-only">التفاصيل</span>
              </a>
        </div>
      </article>

      <article className="supporting-card rsvp-card w-full text-center">
        <div className="rsvp-card-art">
          <Image
            src="/rsvp-confirm-attendance-final.png"
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
        </div>
      </article>

    </motion.main>
  );
}

export default function Home() {
  const [state, setState] = useState<ExperienceState>("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef<MusicController>(null);

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

  return (
    <>
      <CeremonyMusic ref={musicRef} />
      <AnimatePresence mode="wait">
        {state === "details" ? (
          <CeremonyDetails />
        ) : (
          <Landing onOpen={openInvitation} />
        )}
      </AnimatePresence>
      {state === "details" ? (
        <button
          className={`music-toggle${musicPlaying ? " is-playing" : ""}`}
          type="button"
          onClick={toggleMusic}
          aria-pressed={musicPlaying}
          aria-label={musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
          dir="rtl"
        >
          <span className="music-toggle-icon" aria-hidden="true">♪</span>
          <span>{musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}</span>
        </button>
      ) : null}
    </>
  );
}
