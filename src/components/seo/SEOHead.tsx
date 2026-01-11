import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    structuredData?: object | object[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    noindex = false,
    structuredData
}) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

    const baseUrl = 'https://pentaprompt.com';
    const defaultImage = `${baseUrl}/og-image.png`;
    
    // Use translations for default TDK to ensure they match the current language
    const defaultTitle = t('seo.home.title', 'PentaPrompt - Best AI Prompt Library | ChatGPT, Claude & Gemini Prompts');
    const defaultDescription = t('seo.home.description', 'Discover 100+ curated AI prompts for ChatGPT, Claude, and Gemini.');

    const finalTitle = title || defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = image || defaultImage;
    const finalUrl = url || baseUrl;

    // Organization structured data (appears on all pages)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PentaPrompt",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "sameAs": []
    };

    // Combine organization schema with any additional structured data
    const allStructuredData = structuredData
        ? Array.isArray(structuredData)
            ? [organizationSchema, ...structuredData]
            : [organizationSchema, structuredData]
        : [organizationSchema];

    const getLocalizedUrl = (lang: string) => {
        try {
            const urlObj = new URL(finalUrl);
            urlObj.searchParams.set('lng', lang);
            return urlObj.toString();
        } catch (e) {
            return finalUrl;
        }
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang={currentLang} />
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical URL */}
            <link rel="canonical" href={finalUrl} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, follow" />}

            {/* Hreflang for i18n */}
            <link rel="alternate" hreflang="en" href={getLocalizedUrl('en')} />
            <link rel="alternate" hreflang="zh" href={getLocalizedUrl('zh')} />
            <link rel="alternate" hreflang="x-default" href={finalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:site_name" content="PentaPrompt" />
            <meta property="og:locale" content={currentLang === 'zh' ? 'zh_CN' : 'en_US'} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Structured Data */}
            {allStructuredData.map((schema, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEOHead;
