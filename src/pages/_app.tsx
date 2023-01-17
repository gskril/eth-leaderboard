import PlausibleProvider from 'next-plausible';
import React from 'react';
import Script from 'next/script';

import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-JFX7VQ8937"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
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

      <PlausibleProvider domain="ethleaderboard.xyz" trackOutboundLinks>
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  );
}

export default MyApp;
