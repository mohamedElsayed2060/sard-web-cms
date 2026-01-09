"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransitionUI } from "./TransitionProvider";

function normalizePath(input) {
  if (!input) return "/";

  // لو href object
  let s =
    typeof input === "string" ? input : input?.pathname || input?.href || "";

  // لو full URL
  try {
    if (s.startsWith("http")) s = new URL(s).pathname;
  } catch {}

  // شيل query/hash
  s = s.split("?")[0].split("#")[0];

  // خلّيها تبدأ بـ /
  if (!s.startsWith("/")) s = "/" + s;

  // شيل trailing slash (عدا "/")
  if (s.length > 1) s = s.replace(/\/+$/, "");

  return s;
}

export default function TransitionLink({ href, children, timings, ...props }) {
  const router = useRouter();
  const pathname = normalizePath(usePathname());
  const { runSequence } = useTransitionUI();

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button === 1) return;

        const targetPath = normalizePath(href);

        // ✅ نفس الصفحة؟ ما تعملش ترانزيشن
        if (targetPath === pathname) return;

        e.preventDefault();

        runSequence({
          timings,
          onNavigate: async () => router.push(href),
        });
      }}
    >
      {children}
    </Link>
  );
}
