"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { invitationConfig as invitation } from "./invitation-config";

type ExperienceState = "closed" | "opening" | "details";

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
      src={invitation.media.poster}
      alt={invitation.media.alt}
      fill
      priority
      sizes="(max-width: 480px) 65vw, 272px"
      className="object-cover"
      style={{ objectPosition: invitation.media.focalPosition }}
    />
  );
}

function Envelope({ opening, reducedMotion }: { opening: boolean; reducedMotion: boolean }) {
  const gentleEase = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.span
      className="envelope"
      aria-hidden="true"
      animate={
        opening && !reducedMotion
          ? { y: [0, -9, -5], rotate: [0, -0.6, 0] }
          : { y: 0, rotate: 0 }
      }
      transition={{ duration: 0.42, ease: gentleEase }}
    >
      <motion.span
        className="envelope-card"
        animate={
          opening
            ? reducedMotion
              ? { opacity: [0, 1] }
              : { y: ["0%", "-18%", "-142%"], opacity: [0, 1, 1] }
            : { y: 0, opacity: 0 }
        }
        transition={
          reducedMotion
            ? { duration: 0.25 }
            : { duration: 1.02, delay: 0.52, ease: gentleEase, times: [0, 0.2, 1] }
        }
      >
        <span className="card-monogram">I <i>&amp;</i> S</span>
        <span className="card-date">17 · 10 · 2026</span>
      </motion.span>
      <motion.span
        className="whole-envelope-art"
        animate={
          opening && !reducedMotion
            ? { y: [0, -7, 5], rotateX: [0, -5, 0], scale: [1, 1.012, 0.992] }
            : { y: 0, rotateX: 0, scale: 1 }
        }
        transition={{ duration: 0.78, delay: 0.12, ease: gentleEase }}
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
    </motion.span>
  );
}

function Landing({ state, onOpen }: { state: ExperienceState; onOpen: () => void }) {
  const reducedMotion = Boolean(useReducedMotion());
  const opening = state === "opening";

  return (
    <motion.main
      key="landing"
      className="invitation-shell min-h-[100svh] w-full px-3 py-4 sm:px-6 sm:py-8"
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

      <article className="paper-frame landing-card mx-auto flex w-full max-w-[430px] flex-col items-center px-5 pb-6 pt-7 text-center sm:px-9 sm:pb-8 sm:pt-9">
        <header>
          <p className="eyebrow">The wedding of</p>
          <h1 className="couple-names">{invitation.couple.displayNames}</h1>
        </header>

        <figure className="portrait-frame mt-4">
          <div className="portrait-beading" aria-hidden="true" />
          <CoupleMedia />
        </figure>

        <p className="invitation-copy mt-4 max-w-[290px]">{invitation.copy.invitation}</p>

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
          whileTap={opening || reducedMotion ? undefined : { scale: 0.985 }}
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

function CeremonyDetails() {
  const reducedMotion = Boolean(useReducedMotion());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const arabic = invitation.arabicCeremony;

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
          <p className="arabic-blessing">{arabic.blessing}</p>

          <div className="arabic-families">
            <span>{arabic.groomFamily}</span>
            <span>{arabic.brideFamily}</span>
          </div>

          <p className="arabic-invitation-line">{arabic.invitation}</p>

          <h1 ref={headingRef} tabIndex={-1} className="arabic-couple-names">
            <span>{arabic.groomName}</span>
            <i aria-hidden="true">&amp;</i>
            <span>{arabic.brideName}</span>
          </h1>

          <section className="ceremony-summary" aria-label={`موعد الإكليل ${invitation.wedding.date}`}>
            <p>وذلك في تمام الساعة {invitation.wedding.time}</p>
            <p>مساء يوم {arabic.day} الموافق {arabic.dateNumber} {arabic.month} {arabic.year}</p>
            <address>
              <strong>في {invitation.wedding.venue}</strong>
            </address>
          </section>

          <p className="arabic-closing">{arabic.closing}</p>
          <p className="arabic-congratulations">{arabic.congratulations}</p>
        </div>
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
    timerRef.current = setTimeout(() => setState("details"), reducedMotion ? 560 : 2140);
  };

  return (
    <AnimatePresence mode="wait">
      {state === "details" ? (
        <CeremonyDetails />
      ) : (
        <Landing state={state} onOpen={openInvitation} />
      )}
    </AnimatePresence>
  );
}
