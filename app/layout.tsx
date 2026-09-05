import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sara-performance.diego-jj17.chatgpt.site'),
  title: 'SARA Performance — Calibração de performance com IA',
  description:
    'Plataforma de People Intelligence com calibração assíncrona, IA assistida e analytics para reduzir vieses, melhorar feedbacks e diminuir o custo dos ciclos de avaliação.',
  applicationName: 'SARA Performance',
  keywords: [
    'avaliação de performance',
    'calibração assíncrona',
    'people intelligence',
    'IA para RH',
    'gestão de desempenho',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'SARA Performance',
    title: 'SARA Performance — Calibração de performance com IA',
    description:
      'Calibração assíncrona, IA assistida e analytics para decisões de pessoas mais claras, consistentes e eficientes.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SARA Performance — Calibração assíncrona com IA assistiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SARA Performance — Calibração de performance com IA',
    description:
      'Calibração assíncrona, IA assistida e analytics para decisões de pessoas mais consistentes.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
