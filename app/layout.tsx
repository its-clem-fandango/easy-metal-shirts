import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/* CUSTOM SHIRT FONTS */

const samdanEvil = localFont({
  src: "./fonts/SamdanEvil.ttf",
  variable: "--font-samdan-evil",
  display: "swap",
});

const metalLord = localFont({
  src: "./fonts/MetalLord.otf",
  variable: "--font-metal-lord",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easy metal shirt",
  description:
    "Easily create t-shirts with the most common fonts used by metal bands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${metalLord.variable} ${samdanEvil.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
