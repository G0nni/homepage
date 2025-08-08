import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionWrapper } from "./_components/SessionWrapper";

export const metadata: Metadata = {
  title: "Home",
  description: "Homepage browser",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
