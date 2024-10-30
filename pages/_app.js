import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { ThirdwebProvider } from "thirdweb/react";

import { kgRedHands } from "../lib/fonts";
import Layout from "./dashboard/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <SessionProvider session={pageProps.session}>
        <main className={kgRedHands.className}>
          {router.pathname.startsWith("/dashboard") ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
      </SessionProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
