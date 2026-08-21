import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hmm — Questions worth sitting with",
  description: "A pocket deck of 200 questions for conversations that go somewhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
