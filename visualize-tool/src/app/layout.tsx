import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HeaderContainer from "./(components)/containers/Header";
import FooterContainer from "./(components)/containers/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import RecoilProvider from "./(components)/containers/providers";
import "./styles/globals.css";

config.autoAddCss = false; // FontAwesome の CSS オートマウントを無効化
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjSelector",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
          <HeaderContainer />
          <main className="content">
            {children}
          </main>
          <FooterContainer />
        </RecoilProvider>
      </body>
    </html>
  );
}

