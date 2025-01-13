import "./globals.css";
import { NextAuthProvider } from "@/lib/session_provider";
import { Toaster } from "react-hot-toast";
import { Lora, Montserrat, Poppins } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header/Header";

// Lora (Soft and Classic Font)
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
});

// Montserrat (Thick and Bold Font)
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

// Poppins (Modern and Clean Font)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: "TraficMine",
  description: "Understand the traffic of your website more closely!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <NextThemesProvider defaultTheme="system" attribute="class">
          <NextAuthProvider>
          <Header />
            {children}
            <Toaster />
          </NextAuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}