import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "온결 공방 | 한국 전통 공예 (실습용 프로토타입)",
  description: "도자기, 나전칠기, 보자기, 목공예를 소개하는 개발 실습용 프론트엔드 프로토타입입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
