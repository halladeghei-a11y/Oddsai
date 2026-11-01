import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ODDSAI — Football intelligence",
  description: "Football fixtures, odds analysis and probability tools."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="no"><body>{children}</body></html>;
}
