import Head from "next/head";
import Footer from "./Footer";
import layoutStyles from "../styles/Layout.module.css";
import { useRef, useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

export default function Layout({ children, showFixed }) {
  const [reachedFooter, setReachedFooter] = useState(false);
  const bodyRef = useRef();

  useScrollPosition(
    ({ _, currPos }) => {
      if (
        window.innerHeight >= bodyRef.current.getBoundingClientRect().bottom &&
        !reachedFooter
      )
        setReachedFooter(true);
      if (
        window.innerHeight < bodyRef.current.getBoundingClientRect().bottom &&
        reachedFooter
      )
        setReachedFooter(false);
    },
    [reachedFooter],
    bodyRef
  );

  return (
    <div
      ref={bodyRef}
      className={`${layoutStyles.layout} ${
        !showFixed && layoutStyles.removeMargin
      }`}
    >
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon_32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/icons/favicon_64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/icons/favicon_128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/icons/favicon_256.png"
        />

        <title>.eth Leaderboard</title>
        <meta
          name="description"
          content="The most followed Twitter accounts with .eth names."
        />
        <meta property="og:title" content=".eth Leaderboard" />
        <meta
          property="og:description"
          content="The most followed Twitter accounts with .eth names."
        />
        <meta
          property="og:image"
          content="https://ethleaderboard.xyz/sharing.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://ethleaderboard.xyz/" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="/fonts/CircularXXWeb-Bold.woff2" rel="preload" as="font" />
        <link href="/fonts/CircularXXWeb-Book.woff2" rel="preload" as="font" />
        <link href="/fonts/CircularXXWeb-Medium.woff" rel="preload" as="font" />
        <link href="/fonts/CircularXXWeb-Light.woff2" rel="preload" as="font" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-JFX7VQ8937`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <main>{children}</main>
      <Footer />
      <div
        className={`${layoutStyles.showFixedGradient} ${
          showFixed && layoutStyles.showFixed
        } ${reachedFooter && layoutStyles.reachedFooter}`}
      ></div>
    </div>
  );
}
