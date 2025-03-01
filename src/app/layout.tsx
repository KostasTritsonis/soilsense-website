import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FieldsProvider } from "@/context/fields-context";



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
    <ClerkProvider>
      <FieldsProvider>
        <html lang="en">
          <body className={`${inter.className} bg-zinc-100 text-zinc-900 min-h-screen`}>
            <Header />
            <ToastContainer />
            {children}
          </body>
        </html>
      </FieldsProvider>
    </ClerkProvider>
  );
}
