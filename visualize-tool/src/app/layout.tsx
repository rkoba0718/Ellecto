import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HeaderContainer from "./(components)/containers/Header";
import FooterContainer from "./(components)/containers/Footer";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
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
        <HeaderContainer />
        <main className="content">
          {children}
        </main>
        <FooterContainer />
      </body>
    </html>
  );
}
