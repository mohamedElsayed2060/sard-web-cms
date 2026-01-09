// src/components/PageContentReveal.jsx
"use client";

import clsx from "clsx";

export default function PageContentReveal({
  children,
  className = "",
  paperColor,
  bgImage,
}) {
  const style = paperColor ? { "--paper-bg": paperColor } : undefined;

  const bgStyle = bgImage?.src
    ? { backgroundImage: `url('${bgImage.src}')` }
    : style;

  return (
    <div
      style={bgStyle}
      className={clsx(
        bgImage?.src ? "" : paperColor && "paper-noise",
        className
      )}
    >
      {children}
    </div>
  );
}
