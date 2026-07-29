import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Delight Water Shop - Pure Water Solutions",
    template: "%s | Delight Water Shop",
  },
  description:
    "Shop premium RO water purifiers, filters, spare parts, and chemicals. Islandwide delivery across Sri Lanka. Trusted by homes and businesses since 2015.",
  keywords: [
    "RO water purifier Sri Lanka",
    "water filter",
    "reverse osmosis",
    "water treatment",
    "Delight Water Solutions",
  ],
  authors: [{ name: "Delight Water Solutions (Pvt) Ltd" }],
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://shop.delightwatersolutions.com",
    siteName: "Delight Water Shop",
    title: "Delight Water Shop - Pure Water Solutions",
    description:
      "Shop premium RO water purifiers, filters, spare parts, and chemicals. Islandwide delivery across Sri Lanka.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delight Water Shop",
    description:
      "Premium RO water purifiers and water treatment solutions in Sri Lanka",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[var(--background)] antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
