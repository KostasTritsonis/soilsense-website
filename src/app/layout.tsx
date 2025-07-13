import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FieldsProvider } from "@/context/fields-context";
import GlobalLoader from "@/components/global-loader";

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
          <head>
            <link rel="manifest" href="/manifest.json" />
          </head>
          <body
            className={`${inter.className} bg-gradient-to-tr from-[#f9f5ea] via-[#f3ede1] to-[#e6f4ea] text-zinc-900 min-h-screen`}
          >
            <div className="w-full max-w-7xl mx-auto px-4 py-2">
              <div className="bg-gradient-to-tr from-[#f9f5ea] via-[#f3ede1] to-[#e6f4ea] backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-2 mb-6 border border-white/30">
                <Header />
              </div>
              <ToastContainer />
              <GlobalLoader />
              <main className="bg-gradient-to-tr from-[#f9f5ea] via-[#f3ede1] to-[#e6f4ea] backdrop-blur-md rounded-2xl shadow-xl p-6">
                {children}
              </main>
            </div>
          </body>
        </html>
      </FieldsProvider>
    </ClerkProvider>
  );
}
