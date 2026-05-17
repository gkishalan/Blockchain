import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatAppProvider } from "../context/ChatAppContext";
import { LanguageProvider } from "../context/LanguageContext";
import AppShell from "../components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BlockChat - Decentralized Messaging",
  description: "Secure, decentralized chat application powered by Ethereum blockchain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <ChatAppProvider>
            <AppShell>{children}</AppShell>
          </ChatAppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
