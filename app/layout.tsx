import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitch Studio | Startup Application Platform",
  description:
    "Submit your startup pitch and get discovered by top investors. Pitch Studio streamlines the startup application process for founders and investors.",
  keywords: ["startup", "pitch", "investors", "funding", "application"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1e36',
              color: '#f1f1f6',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '10px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f1f1f6',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f1f1f6',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
