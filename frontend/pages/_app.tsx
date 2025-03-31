import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';

// Modo landing page - sin dependencia de Supabase para el despliegue inicial
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
