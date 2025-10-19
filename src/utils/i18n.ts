import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";

// Can be imported from a shared config
const locales = ["en", "el"];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as "en" | "el")) {
    locale = "en"; // fallback to default locale
  }

  let messages = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}`, error);
    // Fallback to English if locale file doesn't exist
    if (locale !== "en") {
      try {
        messages = (await import(`../messages/en.json`)).default;
      } catch (fallbackError) {
        console.error("Failed to load fallback messages", fallbackError);
      }
    }
  }

  return {
    locale,
    messages,
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      } else {
        console.error("Translation error:", error);
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(Boolean).join(".");

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return `${path} is not translated`;
      } else {
        return `Dear developer, please fix this message: ${path}`;
      }
    },
  };
});
