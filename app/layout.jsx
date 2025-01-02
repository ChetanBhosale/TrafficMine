import { Lexend, Poppins,  } from "next/font/google";

import "./globals.css";
import { NextAuthProvider } from "@/lib/session_provider";
import { Toaster } from "react-hot-toast";


const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "TraficMine",
  description: "Understand the traffic of your website more closely!",
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>

 
    <html lang="en">
      <body
        className={`${lexend.className} ${poppins.className} text-poppins `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  </NextAuthProvider>
  );
}
