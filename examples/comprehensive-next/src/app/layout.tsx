import type { Metadata } from "next";
import { RuntimeEnvScript } from "@runtime-env/next-plugin";

export const metadata: Metadata = {
  title: runtimeEnv.NEXT_PUBLIC_HEADERS.TITLE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <RuntimeEnvScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
