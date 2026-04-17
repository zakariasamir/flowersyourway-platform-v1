import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Flowers Your Way — Premium Flower Delivery",
  description:
    "Discover stunning hand-crafted floral arrangements. Fresh flowers for every occasion, delivered with care. Shop roses, tulips, lilies, sunflowers & more.",
  keywords: [
    "flowers",
    "bouquets",
    "flower delivery",
    "roses",
    "tulips",
    "floral arrangements",
  ],
};

import { LanguageProvider } from "@/lib/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    fontFamily: "var(--font-sans)",
                    borderRadius: "12px",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
