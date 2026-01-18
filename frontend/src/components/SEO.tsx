import Head from 'next/head';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
    const siteTitle = "ArianWatch - Modern Anime Streaming";
    const defaultDescription = "Watch anime in high quality for free. Custom lists, tracking, and more.";
    const defaultImage = "https://arianwatch.com/og-image.jpg"; // Placeholder
    const siteUrl = "https://arianwatch.com"; // Placeholder

    return (
        <Head>
            <title>{`${title} | ArianWatch`}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* OpenGraph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Head>
    );
}
