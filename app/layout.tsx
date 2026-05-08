import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainReps",
  description: "Train your mind daily. 10 minutes. No excuses.",
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
