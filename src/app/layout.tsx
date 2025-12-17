import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "Obscura | Private Transfers",
  description: "Private wallet-to-wallet transfers on Solana. Powered by encrypted computation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnimatedBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
