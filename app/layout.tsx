"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./components/StyledComponentsRegistry";
import GlobalStyle from "@/app/components/GlobalStyle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frontend Master Homework",
  description: "Frontend Master 과제 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
