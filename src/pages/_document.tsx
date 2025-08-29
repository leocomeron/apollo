import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta
          name="description"
          content="Encuentra trabajadores calificados para tus proyectos: albañiles, gasistas, plomeros y más oficios en Argentina. Publica trabajos o encuentra trabajo fácilmente."
        />
        <meta
          name="keywords"
          content="albañil argentina, gasista buenos aires, plomero, oficios, construcción, trabajo, mano de obra, servicios, electricista, pintor"
        />
        <meta name="author" content="Leandro Comerón" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Manos a la Obra - Encuentra Trabajadores Calificados"
        />
        <meta
          property="og:description"
          content="Plataforma líder para conectar clientes con trabajadores calificados en Argentina"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_AR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Manos a la Obra - Encuentra Trabajadores Calificados"
        />
        <meta
          name="twitter:description"
          content="Plataforma líder para conectar clientes con trabajadores calificados en Argentina"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
