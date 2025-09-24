import React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title = 'Link Hub Creator - Todos seus links em um só lugar', 
  description = 'Crie uma página personalizada para abrigar todos os links importantes que você quer compartilhar com sua audiência.',
  image = 'https://linkhubcreator.com/og-image.jpg',
  url,
  type = 'website'
}) => {
  const location = useLocation();
  const canonicalUrl = url || `https://linkhubcreator.com${location.pathname}`;

  return (
    <>
      {/* Meta tags básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Link Hub Creator" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
    </>
  );
};