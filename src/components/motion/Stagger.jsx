"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.19, 1, 0.22, 1];

export function Stagger({
  children,
  className,
  once = true,
  amount = 0.2,
  margin = "0px 0px -10% 0px",
  stagger = 0.08,
  delayChildren = 0.05,
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin }}
      variants={{
        hidden: {},
        show: {
          transition: reduce
            ? { duration: 0 }
            : { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

const ITEM_VARIANTS = {
  // default: cinematic card
  fadeUp: {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },

  // nice for chips / small UI blocks
  rise: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  },

  // directionals (for alternating lists)
  slideLeft: {
    hidden: { opacity: 0, x: 18, filter: "blur(6px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  slideRight: {
    hidden: { opacity: 0, x: -18, filter: "blur(6px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  },

  // for images
  imageReveal: {
    hidden: { opacity: 0, scale: 1.03, filter: "blur(10px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },

  // wipe (works well for rows)
  wipeLTR: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    show: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
  },

  // “snappy” card
  pop: {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1 },
  },
};

export function StaggerItem({
  children,
  className,
  variant = "fadeUp",
  duration = 0.6,
}) {
  const reduce = useReducedMotion();
  const v = ITEM_VARIANTS[variant] || ITEM_VARIANTS.fadeUp;

  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
          : {
              hidden: v.hidden,
              show: {
                ...v.show,
                transition: { ease: EASE, duration },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}
