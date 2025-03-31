import React from 'react';
import BrandingGuide from '../components/BrandingGuide';
import Head from 'next/head';

const BrandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Guía de Branding | Fingro</title>
        <meta name="description" content="Guía oficial de branding para Fingro" />
      </Head>
      <BrandingGuide />
    </>
  );
};

export default BrandingPage;
