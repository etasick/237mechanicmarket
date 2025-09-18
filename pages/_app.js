// pages/_app.js
import "../styles/globals.css";
import { HelmetProvider } from "react-helmet-async";
import { Authenticator } from "@aws-amplify/ui-react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import "../src/amplifyClient";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Silence console logs in production only
  /*if (process.env.NODE_ENV === "production") {
    // Keep console.error if you still want to see critical errors in monitoring tools
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    // If you *really* want to hide everything:
    console.error = () => {};
  }*/

  return (
    <Authenticator.Provider>
      <HelmetProvider>
        <NextIntlClientProvider
          locale={router.locale}
          messages={pageProps?.messages}
        >
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
        </NextIntlClientProvider>
      </HelmetProvider>
    </Authenticator.Provider>
  );
}

export default MyApp;
