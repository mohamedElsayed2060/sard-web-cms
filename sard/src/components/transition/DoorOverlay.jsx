"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionUI } from "./TransitionProvider";

import marimBg from "@/assets/marim-bg.png";
import dalImg from "@/assets/brand-mark.svg";

const EASE = [0.19, 1, 0.22, 1];

export default function DoorOverlay() {
  const { ui } = useTransitionUI();
  const { visible, phase } = ui;

  const isClosingOrLogo =
    phase === "closing" || phase === "logo" || phase === "boot";
  const isOpening = phase === "opening";
  const isFading = phase === "fading";

  // ✅ خلي الفيد يتم بعد ما الدرفتين يطلعوا برا
  const containerAnimate = isFading ? { opacity: [1, 1, 0] } : { opacity: 1 };

  const containerTransition = isFading
    ? { duration: 1.9, times: [0, 0.75, 1], ease: EASE }
    : { duration: 0.6, ease: EASE };

  const CLOSED_LEFT = { rotateY: 0, x: 0, z: 0 };
  const CLOSED_RIGHT = { rotateY: 0, x: 0, z: 0 };

  const OPEN_LEFT = { rotateY: 105, x: 0, z: -40 };
  const OPEN_RIGHT = { rotateY: -105, x: 0, z: -40 };

  // ✅ يكمّل برا (الاتنين)
  const OUT_LEFT = {
    rotateY: 180,
    x: "-150%", // Increased from -100%
    z: -400, // Increased from -300
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  };
  const OUT_RIGHT = {
    rotateY: -180,
    x: "150%", // Increased from 100%
    z: -400, // Increased from -300
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  };

  const bgUrl = `url(${marimBg?.src || marimBg})`;
  const dalUrl = dalImg?.src || dalImg;

  const isBoot = phase === "boot";
  const doorDuration = isBoot
    ? 0.01
    : isClosingOrLogo
    ? 0.8
    : isFading
    ? 0.9
    : 1.25;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          animate={containerAnimate}
          exit={{ opacity: 0 }}
          transition={containerTransition}
          style={{ perspective: 1400 }}
        >
          {/* Backdrop: يظهر وقت القفل/اللوجو فقط */}
          <motion.div
            className="absolute inset-0 z-10 bg-black/10 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosingOrLogo ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />

          {/* الباب */}
          <div
            className="absolute inset-0 flex z-20"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* LEFT leaf */}
            <motion.div
              className="h-full w-1/2 rounded-r-xl"
              style={{
                transformOrigin: "0% 50%",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backgroundImage: bgUrl,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "inset -40px 0 70px rgba(0,0,0,0.35)",
              }}
              initial={phase === "boot" ? CLOSED_LEFT : OPEN_LEFT}
              animate={
                isClosingOrLogo ? CLOSED_LEFT : isFading ? OUT_LEFT : OPEN_LEFT
              }
              transition={{ ease: EASE, duration: doorDuration }}
            />

            {/* RIGHT leaf */}
            <motion.div
              className="h-full w-1/2 rounded-l-xl"
              style={{
                transformOrigin: "100% 50%",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backgroundImage: bgUrl,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "inset 40px 0 70px rgba(0,0,0,0.35)",
              }}
              initial={phase === "boot" ? CLOSED_RIGHT : OPEN_RIGHT}
              animate={
                isClosingOrLogo
                  ? CLOSED_RIGHT
                  : isFading
                  ? OUT_RIGHT
                  : OPEN_RIGHT
              }
              transition={{ ease: EASE, duration: doorDuration }}
            />
          </div>

          {/* حرف (د) فوق الباب */}
          <motion.div
            className="absolute inset-0 grid place-items-center z-30"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: phase === "logo" || phase === "boot" ? 1 : 0,
              scale: 1,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <img
              src={dalUrl}
              alt="Dal"
              style={{ width: 100, height: "auto" }}
            />
          </motion.div>

          {/* crack line */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-[2px] bg-black/40 z-25"
            initial={{ opacity: 1 }}
            animate={{ opacity: isOpening || isFading ? 0 : 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
