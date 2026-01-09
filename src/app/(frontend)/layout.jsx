// src/app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";

import { TransitionProvider } from "@/components/transition/TransitionProvider";
import DoorOverlay from "@/components/transition/DoorOverlay";
import TransitionBridge from "@/components/transition/TransitionBridge";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sard",
  description: "Cinematic storytelling universe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className + " bg-black text-white overflow-x-hidden"}
      >
        <TransitionProvider>
          <DoorOverlay />
          <TransitionBridge />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
