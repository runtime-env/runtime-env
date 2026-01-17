import type { Metadata } from "next";
import { RuntimeEnvScript } from "@runtime-env/next-plugin";

export const metadata: Metadata = {
  title: `Runtime Env - ${runtimeEnv.NEXT_PUBLIC_FOO}`,
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
