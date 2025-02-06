import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "SoilSense",
  description: "App for Agricultural Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-100 text-zinc-900 min-h-screen`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
