"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { invitationConfig as invitation } from "./invitation-config";

type ExperienceState = "closed" | "opening" | "details";
type TimelineItem = (typeof invitation.arabicCeremony.timeline)[number];

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
    <span className="framed-portrait">
      <Image
        src={invitation.media.poster}
        alt=""
        width={1890}
        height={2363}
        priority
        sizes="(max-width: 480px) 100vw, 430px"
        className="landing-image"
        aria-hidden="true"
      />
      <span className="portrait-window">
        <Image
          src={invitation.media.src}
          alt={invitation.media.alt}
          fill
          priority
          sizes="(max-width: 480px) 42vw, 178px"
          className="portrait-photo"
          style={{ objectPosition: invitation.media.focalPosition }}
        />
      </span>
    </span>
  );
}

function Envelope({ opening, reducedMotion }: { opening: boolean; reducedMotion: boolean }) {
  const gentleEase = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.span
      className="envelope"
      aria-hidden="true"
      animate={
        opening
          ? reducedMotion
            ? { opacity: [1, 0.82, 1] }
            : {
                y: [0, -7, -18, -5],
                rotate: [0, -0.5, 0.7, 0],
                scale: [1, 0.985, 1.025, 1],
              }
          : { y: 0, rotate: 0, scale: 1, opacity: 1 }
      }
      transition={
        reducedMotion
          ? { duration: 0.28 }
          : { duration: 1.18, ease: gentleEase, times: [0, 0.18, 0.58, 1] }
      }
    >
      <motion.span
        className="whole-envelope-art"
        animate={
          opening
            ? reducedMotion
              ? { opacity: [1, 0.78, 1] }
              : {
                  y: [0, -4, 4, 0],
                  rotateX: [0, -7, -22, 0],
                  scale: [1, 1.02, 0.99, 1],
                  filter: ["brightness(1)", "brightness(1.04)", "brightness(1.09)", "brightness(1)"],
                }
            : { y: 0, rotateX: 0, scale: 1, filter: "brightness(1)", opacity: 1 }
        }
        transition={
          reducedMotion
            ? { duration: 0.28 }
            : { duration: 1.05, delay: 0.08, ease: gentleEase, times: [0, 0.22, 0.62, 1] }
        }
      >
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
      </motion.span>
      <motion.span
        className="envelope-opening-seam"
        animate={
          opening
            ? reducedMotion
              ? { opacity: [0, 0.35, 0] }
              : { opacity: [0, 0.18, 0.75, 0], scaleX: [0.42, 0.62, 1.04, 1.12] }
            : { opacity: 0, scaleX: 0.42 }
        }
        transition={
          reducedMotion
            ? { duration: 0.28 }
            : { duration: 0.82, delay: 0.26, ease: gentleEase, times: [0, 0.25, 0.67, 1] }
        }
      />
    </motion.span>
  );
}

function CeremonyMusic({ active }: { active: boolean }) {
  if (!active) return null;

  const videoId = invitation.music.youtubeVideoId;
  const source = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;

  return (
    <iframe
      className="ceremony-music"
      src={source}
      title={invitation.music.title}
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function Landing({ state, onOpen }: { state: ExperienceState; onOpen: () => void }) {
  const reducedMotion = Boolean(useReducedMotion());
  const opening = state === "opening";

  return (
    <motion.main
      key="landing"
      className="invitation-shell min-h-[100svh] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.48 }}
    >
      <motion.div
        className="opening-wash"
        aria-hidden="true"
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0.25 : 1.05, delay: reducedMotion ? 0 : 1.05 }}
      />

      <article className="landing-card mx-auto flex w-full max-w-[430px] flex-col items-center pb-6 text-center">
        <figure className="landing-art">
          <CoupleMedia />
        </figure>

        <p className="invitation-copy mt-4 max-w-[290px] px-4">{invitation.copy.invitation}</p>

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
          disabled={opening}
          aria-label={opening ? "Opening the wedding invitation" : "Open the wedding invitation"}
          aria-busy={opening}
          whileHover={opening || reducedMotion ? undefined : { y: -3 }}
          whileTap={opening || reducedMotion ? undefined : { scale: 0.965, y: 2 }}
        >
          <Envelope opening={opening} reducedMotion={reducedMotion} />
        </motion.button>
        <p className="tap-prompt" aria-live="polite">
          {opening ? "Opening…" : invitation.copy.openPrompt}
        </p>
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
  const revealAt = index * 0.15;
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
    offset: ["start 85%", "end 15%"],
  });
  const acceleratedTimelineProgress = useTransform(timelineScrollProgress, [0, 0.78], [0, 1], { clamp: true });
  const timelineProgress = useSpring(acceleratedTimelineProgress, {
    stiffness: 240,
    damping: 26,
    mass: 0.18,
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
    </motion.main>
  );
}

export default function Home() {
  const reducedMotion = Boolean(useReducedMotion());
  const [state, setState] = useState<ExperienceState>("closed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const openInvitation = () => {
    if (state !== "closed") return;
    setState("opening");
    timerRef.current = setTimeout(() => setState("details"), reducedMotion ? 420 : 1650);
  };

  return (
    <AnimatePresence mode="wait">
      <CeremonyMusic active={state !== "closed"} />
      {state === "details" ? (
        <CeremonyDetails />
      ) : (
        <Landing state={state} onOpen={openInvitation} />
      )}
    </AnimatePresence>
  );
}
