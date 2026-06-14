import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "灣灣拾光 Loverbay Moment Space",
  description: "宜蘭海岸第一排私密包場空間，一次只接待一組VIP貴賓。Yilan oceanfront private exclusive rental.",
  keywords: "宜蘭包場, 海景民宿, 私密空間, Yilan, oceanfront, private rental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
