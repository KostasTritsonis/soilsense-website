import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreInitializer from "@/components/store-initializer";
import GlobalLoader from "@/components/global-loader";
import ThemeInitializer from "@/components/theme-initializer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SoilSense - Agricultural Monitoring Platform",
  description: "Professional agricultural monitoring and management platform",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100 min-h-screen antialiased`}
        suppressHydrationWarning={true}
      >
        <ClerkProvider
          signInUrl={`/${locale}/sign-in`}
          signUpUrl={`/${locale}/sign-up`}
          afterSignOutUrl={`/${locale}`}
        >
          <NextIntlClientProvider messages={messages}>
            <div className="w-full max-w-7xl mx-auto px-6 py-6">
              {/* Desktop Header - only show on md and above */}
              <div className="hidden md:block bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 pb-6 overflow-visible relative z-50">
                <Header />
              </div>

              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <StoreInitializer />
              <ThemeInitializer />
              <GlobalLoader />

              {/* Main content with mobile padding adjustment */}
              <main className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-8 mt-6 pb-20 md:pb-8 relative z-10">
                {children}
              </main>

              {/* Mobile Header - positioned at bottom for mobile */}
              <div className="md:hidden">
                <Header />
              </div>
            </div>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
