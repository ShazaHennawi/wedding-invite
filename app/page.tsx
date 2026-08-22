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
      <span className="envelope-back" />
      <motion.span
        className="envelope-card"
        animate={
          opening
            ? reducedMotion
              ? { opacity: [0, 1] }
              : { y: [0, -8, -92], opacity: [0, 1, 1] }
            : { y: 0, opacity: 0 }
        }
        transition={
          reducedMotion
            ? { duration: 0.25 }
            : { duration: 0.92, delay: 0.62, ease: gentleEase, times: [0, 0.2, 1] }
        }
      >
        <span className="card-monogram">I <i>&amp;</i> S</span>
        <span className="card-date">17 · 10 · 2026</span>
      </motion.span>
      <span className="envelope-front" />
      <motion.span
        className="envelope-flap"
        animate={
          opening && !reducedMotion
            ? { rotateX: -174, zIndex: 1 }
            : { rotateX: 0, zIndex: 5 }
        }
        transition={{ duration: 0.68, delay: 0.18, ease: gentleEase }}
      >
        <Image
          src="/envelope-reference.png"
          alt=""
          fill
          sizes="300px"
          className="flap-ornament"
          aria-hidden="true"
        />
      </motion.span>
      <motion.span
        className="wax-seal"
        animate={opening ? { opacity: 0, scale: 0.72 } : { opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.28, delay: reducedMotion ? 0 : 0.08 }}
      >
        IS
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

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function CeremonyDetails() {
  const reducedMotion = Boolean(useReducedMotion());
  const headingRef = useRef<HTMLHeadingElement>(null);

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
      <article className="paper-frame detail-card mx-auto w-full max-w-[560px] px-6 py-9 text-center sm:px-12 sm:py-12">
        <div className="monogram" aria-hidden="true">
          <span>I</span><i>&amp;</i><span>S</span>
        </div>
        <p className="eyebrow">Together forever</p>
        <h1 ref={headingRef} tabIndex={-1} className="detail-names">
          {invitation.couple.displayNames}
        </h1>
        <p className="detail-intro">joyfully invite you to share in their wedding celebration</p>

        <div className="ornament-rule" aria-hidden="true"><span>❦</span></div>

        <dl className="details-list">
          <DetailRow label="Date">{invitation.wedding.date}</DetailRow>
          <DetailRow label="Ceremony">{invitation.wedding.time}</DetailRow>
          <DetailRow label="Venue">{invitation.wedding.venue}</DetailRow>
          <DetailRow label="Address">{invitation.wedding.address}</DetailRow>
          <DetailRow label="Dress code">{invitation.wedding.dressCode}</DetailRow>
        </dl>

        <a
          className="maps-button"
          href={invitation.wedding.mapUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the ceremony address in Google Maps (opens in a new tab)"
        >
          Open in Maps <span aria-hidden="true">↗</span>
        </a>

        <blockquote className="personal-message">“{invitation.wedding.message}”</blockquote>
        <p className="closing-mark">With love</p>
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
