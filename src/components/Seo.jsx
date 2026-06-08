import { Helmet } from 'react-helmet-async';

export default function Seo({ title, description, path = '/' }) {
  const siteName = 'Fajar A. Saputra';
  const baseUrl = 'https://your-domain.com';
  const url = `${baseUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;
  const image = `${baseUrl}/og-cover.svg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
