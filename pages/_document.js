import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff0000" />

        {/* Favicon and PWA icons */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* App title for Apple devices */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KSTracker" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
