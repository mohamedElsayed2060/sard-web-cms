"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTransitionUI } from "./TransitionProvider";

export default function TransitionBridge() {
  const pathname = usePathname();
  const api = useTransitionUI();

  useEffect(() => {
    api.setCurrentPath?.(pathname);
  }, [pathname, api]);

  return null;
}
