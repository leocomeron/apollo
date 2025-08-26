import { SpeedInsights } from '@vercel/speed-insights/next';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Buscar o encontrar trabajo" />
        <meta
          name="keywords"
          content="albañil, trabajo, oficio, construcción"
        />
        <meta name="author" content="Leandro Comerón" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <SpeedInsights />
      </body>
    </Html>
  );
}
