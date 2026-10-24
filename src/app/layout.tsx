import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoProvider } from "@/components/demo-provider";
import "./globals.css";
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "ClaimMe — Every claim, clearer.",
    template: "%s · ClaimMe",
  },
  description:
    "Understand your insurance claim. Every status, document and deduction explained with evidence. Explore an illustrative health-insurance claim.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className={`${sans.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
