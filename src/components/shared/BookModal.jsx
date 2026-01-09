"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import marimBg from "@/assets/marim-bg.png";
import dalImg from "@/assets/brand-mark.svg";

const EASE = [0.19, 1, 0.22, 1];

export default function BookModal({
  open,
  onClose,
  children,

  // timings
  introMs = 450, // مدة ظهور حرف (د) وهو مقفول
  openMs = 1200, // مدة فتح الباب
  fadeMs = 550, // مدة اختفاء الدرفتين بعد الفتح
  closeMs = 850, // مدة قفل الباب عند الإغلاق

  // visuals
  paperBg = "#F4E8D7",
  maxWidth = 980,
  maxHeight = 640,
}) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | boot | opening | fading | shown | closing
  const [canClose, setCanClose] = useState(false);

  const bgUrl = useMemo(() => `url(${marimBg?.src || marimBg})`, []);
  const dalUrl = useMemo(() => dalImg?.src || dalImg, []);

  // door states (نفس doubleDoor)
  const CLOSED_LEFT = { rotateY: 0, z: 0 };
  const CLOSED_RIGHT = { rotateY: 0, z: 0 };
  const OPEN_LEFT = { rotateY: 105, z: -40 };
  const OPEN_RIGHT = { rotateY: -105, z: -40 };

  // helper
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // open sequence
  useEffect(() => {
    let cancelled = false;

    async function runOpen() {
      setMounted(true);
      setCanClose(false);

      // يبدأ مقفول + حرف (د)
      setPhase("boot");
      await sleep(introMs);
      if (cancelled) return;

      // فتح
      setPhase("opening");
      await sleep(openMs);
      if (cancelled) return;

      // اختفاء الدرفتين تدريجيًا
      setPhase("fading");
      await sleep(fadeMs);
      if (cancelled) return;

      setPhase("shown");
      setCanClose(true);
    }

    async function runClose() {
      setCanClose(false);

      // 1) رجّع الدرفتين تظهر (لو كانت مختفية)
      setPhase("restore");
      await sleep(180); // مدة قصيرة لإظهار الدرفتين
      if (cancelled) return;

      // 2) اقفل الباب بهدوء
      setPhase("closing");
      await sleep(closeMs);
      if (cancelled) return;

      setPhase("idle");
      setMounted(false);
    }

    if (open) runOpen();
    else if (mounted) runClose();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!mounted) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  const isBoot = phase === "boot";
  const isOpening = phase === "opening";
  const isFading = phase === "fading";
  const isShown = phase === "shown";
  const isClosing = phase === "closing";

  // الدرفتين: امتى تبقى مفتوحة/مقفولة
  const leftDoorTarget = isBoot || isClosing ? CLOSED_LEFT : OPEN_LEFT;

  const rightDoorTarget = isBoot || isClosing ? CLOSED_RIGHT : OPEN_RIGHT;
  const isRestore = phase === "restore";

  // شفافية الدرفتين: بعد الفتح تختفي، وعند القفل ترجع تظهر
  const doorsOpacityTarget = isFading ? 0 : isShown ? 0 : isRestore ? 1 : 1;

  // خلفية سوداء تمنع “فلاش” أثناء boot/closing فقط
  const solidBackdropTarget = isBoot || isClosing || isRestore ? 1 : 0;

  // حرف (د): يظهر في boot (وممكن كمان أول opening لو حبيت)
  const dalOpacityTarget = isBoot ? 1 : 0;

  const modalSizeStyle = {
    width: `min(${maxWidth}px, 92vw)`,
    height: `min(${maxHeight}px, 85vh)`,
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* خلفية المودال (dim) */}
        <motion.button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-black/70"
          onClick={() => onClose?.()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        />

        {/* جسم المودال */}
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          style={modalSizeStyle}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* الكونتنت (يكون ظاهر والباب بيفتح) */}
          <div className="absolute inset-0" style={{ background: paperBg }}>
            {children}
          </div>

          {/* طبقة الباب */}
          <motion.div
            className="absolute inset-0"
            style={{ perspective: 1400 }}
          >
            {/* solid backdrop أثناء boot/closing فقط */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 1 }}
              animate={{ opacity: solidBackdropTarget }}
              transition={{ duration: 0.45, ease: EASE }}
            />

            {/* حرف (د) فوق الباب */}
            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: dalOpacityTarget, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ zIndex: 30 }}
            >
              <img
                src={dalUrl}
                alt="Dal"
                style={{ width: 100, height: "auto" }}
              />
            </motion.div>

            {/* الدرفتين */}
            <motion.div
              className="absolute inset-0 flex"
              style={{ transformStyle: "preserve-3d", zIndex: 20 }}
              initial={{ opacity: 1 }}
              animate={{ opacity: doorsOpacityTarget }}
              transition={{
                duration: isFading ? fadeMs / 1000 : 0.25,
                ease: EASE,
              }}
            >
              {/* LEFT leaf */}
              <motion.div
                className="h-full w-1/2"
                style={{
                  transformOrigin: "0% 50%",
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  backgroundImage: bgUrl,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "inset -40px 0 70px rgba(0,0,0,0.35)",
                }}
                // مهم: في boot يبدأ مقفول، في غيره يبدأ مفتوح (عشان ما يفلّش)
                initial={isBoot ? CLOSED_LEFT : OPEN_LEFT}
                animate={leftDoorTarget}
                transition={{
                  duration: isBoot
                    ? 0
                    : isOpening
                    ? openMs / 1000
                    : isClosing
                    ? closeMs / 1000
                    : 0.6,
                  ease: EASE,
                }}
              />

              {/* RIGHT leaf */}
              <motion.div
                className="h-full w-1/2"
                style={{
                  transformOrigin: "100% 50%",
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  backgroundImage: bgUrl,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "inset 40px 0 70px rgba(0,0,0,0.35)",
                }}
                initial={isBoot ? CLOSED_RIGHT : OPEN_RIGHT}
                animate={rightDoorTarget}
                transition={{
                  duration: isBoot
                    ? 0
                    : isOpening
                    ? openMs / 1000
                    : isClosing
                    ? closeMs / 1000
                    : 0.6,
                  ease: EASE,
                }}
              />
            </motion.div>

            {/* crack line */}
            <motion.div
              className="absolute left-1/2 top-0 h-full w-[2px] bg-black/40"
              initial={{ opacity: 1 }}
              animate={{ opacity: isOpening || isFading || isShown ? 0 : 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ zIndex: 25 }}
            />
          </motion.div>

          {/* زر إغلاق (اختياري) */}
          <button
            type="button"
            className="absolute right-3 top-3 z-[100] rounded-full bg-black/40 px-3 py-2 text-xs text-white hover:bg-black/60"
            onClick={() => onClose?.()}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
