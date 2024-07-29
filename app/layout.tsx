import AudioProvider from "@/providers/AudioProvider";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddipod",
  description: "Generate your podcast using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body className={manrope.className}>
          <AudioProvider>{children}</AudioProvider>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
