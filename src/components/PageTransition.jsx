// src/components/PageTransition.jsx
"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const overlayVariants = {
  fade: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    style: {},
    transition: {
      duration: 0.9,
      ease: [0.19, 1, 0.22, 1],
    },
  },

  curtainLeft: {
    initial: { opacity: 1, scaleX: 1 },
    animate: { opacity: 0, scaleX: 0 },
    style: { transformOrigin: "0% 50%" },
    transition: {
      duration: 1.1,
      ease: [0.19, 1, 0.22, 1],
    },
  },

  curtainRight: {
    initial: { opacity: 1, scaleX: 1 },
    animate: { opacity: 0, scaleX: 0 },
    style: { transformOrigin: "100% 50%" },
    transition: {
      duration: 1.1,
      ease: [0.19, 1, 0.22, 1],
    },
  },

  spotlight: {
    initial: { opacity: 1, scale: 1.2 },
    animate: { opacity: 0, scale: 1 },
    style: { transformOrigin: "50% 50%" },
    transition: {
      duration: 1.0,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export default function PageTransition({ children, variant = "fade" }) {
  const pathname = usePathname();

  // ⭐️ حالة خاصة: splitCenter (اتنين panels بيتفتحوا من النص لبرة)
  if (variant === "splitCenter") {
    const transition = {
      duration: 9.1,
      ease: [0.19, 1, 0.22, 1],
    };

    return (
      <div className="relative min-h-[100dvh]">
        {children}

        <div className="pointer-events-none fixed inset-0 z-50 flex">
          {/* الجزء الشمال */}
          <motion.div
            key={pathname + "-left"}
            className="flex-1 bg-black"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }} // يمشي برا الشاشة ناحية الشمال
            transition={transition}
          />

          {/* الجزء اليمين */}
          <motion.div
            key={pathname + "-right"}
            className="flex-1 bg-black"
            initial={{ x: 0 }}
            animate={{ x: "100%" }} // يمشي برا الشاشة ناحية اليمين
            transition={transition}
          />
        </div>
      </div>
    );
  }
  if (variant === "doubleDoor") {
    const transition = {
      duration: 10.05,
      ease: [0.19, 1, 0.22, 1],
    };

    return (
      <div className="relative min-h-[100dvh]">
        {children}

        <div
          className="pointer-events-none fixed inset-0 z-50 flex"
          style={{ perspective: 1400 }}
        >
          {/* LEFT door leaf (مفصلة على الشمال) */}
          <motion.div
            key={pathname + "-door-left"}
            className="w-1/2 h-full bg-black"
            style={{
              transformOrigin: "0% 50%", // hinge at left edge
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
            initial={{ rotateY: 0, z: 0 }}
            animate={{ rotateY: 105, z: -40 }} // ✅ swing
            transition={transition}
          />

          {/* RIGHT door leaf (مفصلة على اليمين) */}
          <motion.div
            key={pathname + "-door-right"}
            className="w-1/2 h-full bg-black"
            style={{
              transformOrigin: "100% 50%", // hinge at right edge
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
            initial={{ rotateY: 0, z: 0 }}
            animate={{ rotateY: -105, z: -40 }} // ✅ swing opposite
            transition={transition}
          />

          {/* crack line في النص (اختياري) */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-[2px] bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ ...transition, duration: 0.6 }}
          />
        </div>
      </div>
    );
  }

  // باقي الvariants العادية
  const config = overlayVariants[variant] || overlayVariants.fade;

  return (
    <div className="relative min-h-[100dvh]">
      {children}

      <motion.div
        key={pathname}
        className="pointer-events-none fixed inset-0 z-50 bg-black"
        style={config.style}
        initial={config.initial}
        animate={config.animate}
        transition={config.transition}
      />
    </div>
  );
}
