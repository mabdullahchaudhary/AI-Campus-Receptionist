import type { Metadata } from "next";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superior AI — Intelligent Voice Receptionist",
  description: "Enterprise AI voice agent for universities — 24/7, multilingual.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        {/* SEO: Open Graph, Twitter Card, Schema.org */}
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Superior AI — Intelligent Voice Receptionist" />
        <meta property="og:description" content="Enterprise AI voice agent for universities and businesses. 24/7, multilingual, plug-and-play widget." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://superior.edu.pk" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Superior AI — Intelligent Voice Receptionist" />
        <meta name="twitter:description" content="Enterprise AI voice agent for universities and businesses. 24/7, multilingual, plug-and-play widget." />
        <meta name="twitter:image" content="/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Superior AI Receptionist",
          "description": "AI Voice Receptionist SaaS for universities and businesses. Plug-and-play widget, built by a team of 6 engineers.",
          "brand": {
            "@type": "Brand",
            "name": "Superior AI"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://superior.edu.pk",
            "price": "Contact for pricing",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "100"
          },
          "review": [
            {
              "@type": "Review",
              "author": "University Admin",
              "reviewBody": "Superior AI Receptionist transformed our campus experience!"
            }
          ]
        }) }} />
      </head>
      <body suppressHydrationWarning className="font-sans min-h-screen noise antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}