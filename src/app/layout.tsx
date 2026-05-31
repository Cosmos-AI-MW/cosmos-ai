import "~/styles/globals.css";
import { type Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Cosmos AI — Shaping Tomorrow With AI",
  description:
    "Cosmos AI provides artificial intelligence consulting, custom solutions, training, and data analytics for businesses and institutions across Malawi.",
  icons: [
    { rel: "icon", url: "/images/cosmos_favicon.png" },
    { rel: "apple-touch-icon", url: "/images/cosmos_favicon.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-cosmos-chalk text-cosmos-night font-sans antialiased">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
