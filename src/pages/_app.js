import PlausibleProvider from 'next-plausible';

import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="ethleaderboard.xyz" trackOutboundLinks>
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}

export default MyApp;
