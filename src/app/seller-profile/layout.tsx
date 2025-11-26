import '@/app/seller-profile/styles/globals.css';
import type { AppProps } from 'next/app';


export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}