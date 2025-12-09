import type { Metadata } from "next";
import "@/app/globals.css";

import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

export const metadata: Metadata = {
  title: {
    template: '%s | Handcrafted Haven',
    default: "Handcrafted Haven",
  },
  description: "Welcome to Handcrafted Haven",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
