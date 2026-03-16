import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
