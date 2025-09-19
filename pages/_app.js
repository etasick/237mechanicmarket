// pages/_app.js
import "../styles/globals.css";
import { HelmetProvider } from "react-helmet-async";
import { Authenticator } from "@aws-amplify/ui-react";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { Amplify } from "aws-amplify";
import awsconfig from "@/src/aws-exports";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  Amplify.configure({
  ...awsconfig,
  aws_appsync_authenticationType: "API_KEY",
  ssr:true,
});

  // Silence console logs in production only
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Keep console.error if you want critical errors
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    // Uncomment if you want to silence errors too (not recommended!)
    // console.error = () => {};
  }

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
