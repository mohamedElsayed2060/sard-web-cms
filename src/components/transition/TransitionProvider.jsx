"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

const TransitionCtx = createContext(null);

export function useTransitionUI() {
  const ctx = useContext(TransitionCtx);
  if (!ctx)
    throw new Error("useTransitionUI must be used within TransitionProvider");
  return ctx;
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export function TransitionProvider({ children }) {
  const [ui, setUI] = useState({ visible: false, phase: "idle" });
  const lockRef = useRef(false);
  const currentPathRef = useRef(null);
  const pathWaiterRef = useRef(null);

  const waitForPathChange = (fromPath, timeoutMs = 8000) =>
    new Promise((resolve) => {
      // لو اتغير بالفعل
      if (currentPathRef.current && currentPathRef.current !== fromPath) {
        return resolve(true);
      }

      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        pathWaiterRef.current = null;
        resolve(false);
      }, timeoutMs);

      pathWaiterRef.current = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        pathWaiterRef.current = null;
        resolve(true);
      };
    });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const api = useMemo(() => {
    return {
      ui,
      setCurrentPath(pathname) {
        const prev = currentPathRef.current;
        currentPathRef.current = pathname;

        // لو كنا مستنيين تغيير path واتغير فعلاً
        if (prev && pathname !== prev && pathWaiterRef.current) {
          pathWaiterRef.current();
        }
      },
      // ✅ العادي: يقفل -> (د) -> يفتح -> يختفي (لـ TransitionLink)
      async runSequence({ onNavigate, timings }) {
        if (lockRef.current) return;
        lockRef.current = true;

        const t = {
          closeMs: 650,
          logoMs: 450,
          openMs: 1100,
          fadeMs: 650,
          maxWaitMs: 8000, // ✅ أقصى وقت نستنى فيه تغيّر الصفحة
          ...timings,
        };

        setUI({ visible: true, phase: "closing" });
        await sleep(t.closeMs);

        // ✅ امسك الـ path الحالي قبل ما نعمل navigate
        const beforePath = currentPathRef.current;

        await onNavigate?.();

        setUI({ visible: true, phase: "logo" });

        // ✅ نستنى logoMs وفي نفس الوقت نستنى الـ route يتغير (الصفحة الجديدة تبقى جاهزة)
        await Promise.all([
          sleep(t.logoMs),
          waitForPathChange(beforePath, t.maxWaitMs),
        ]);

        setUI({ visible: true, phase: "opening" });
        await sleep(t.openMs);

        setUI({ visible: true, phase: "fading" });
        await sleep(t.fadeMs);

        setUI({ visible: false, phase: "idle" });
        lockRef.current = false;
      },

      // ✅ للريفريش / back-forward: يبدأ مقفول ثم يفتح (بدون قفل)
      async runEnterSequence(timings) {
        if (lockRef.current) return;
        lockRef.current = true;

        const t = { logoMs: 420, openMs: 1200, fadeMs: 650, ...timings };

        // boot = مقفول + يظهر (د)
        setUI({ visible: true, phase: "boot" });
        await nextFrame();
        await nextFrame();
        await sleep(t.logoMs);

        setUI({ visible: true, phase: "opening" });
        await sleep(t.openMs);

        setUI({ visible: true, phase: "fading" });
        await sleep(t.fadeMs);

        setUI({ visible: false, phase: "idle" });
        lockRef.current = false;
      },
    };
  }, [ui]);

  // ✅ back/forward
  useEffect(() => {
    const onPop = () =>
      api.runEnterSequence({ logoMs: 520, openMs: 1050, fadeMs: 550 });

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [api]);

  // ✅ أول تحميل / ريفريش
  useEffect(() => {
    api.runEnterSequence({ logoMs: 380, openMs: 1200, fadeMs: 650 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Blur content أثناء الترانزيشن بدل الشاشة السودة
  useEffect(() => {
    const on = ui.visible && ui.phase !== "idle";
    document.documentElement.toggleAttribute("data-transitioning", on);
  }, [ui.visible, ui.phase]);

  return (
    <TransitionCtx.Provider value={api}>{children}</TransitionCtx.Provider>
  );
}
