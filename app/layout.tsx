import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout';
import { Roboto } from 'next/font/google';

// Настройка шрифта Roboto
const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'LuckyBox - Упаковка и Фулфилмент для вашего бизнеса',
  description: 'Комплексные услуги фулфилмента для вашего бизнеса: хранение, упаковка, доставка. Профессиональное решение для эффективной логистики.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`overflow-x-hidden ${roboto.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Предзагрузка критических ресурсов */}
        <link rel="preload" href="/logo.webp" as="image" />
        
        {/* Добавляем мета-тег для принудительного использования HTTPS */}
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* Мета-теги */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="LuckyBox - профессиональные решения для упаковки вашей продукции" />
        <meta property="og:title" content="LuckyBox" />
        <meta property="og:description" content="Профессиональные решения для упаковки вашей продукции" />
        <meta property="og:image" content="/og-image.jpg" />
      </head>
      <body className={`overflow-x-hidden ${roboto.className}`}>
        {/* Yandex Maps API */}
        <Script
          id="yandex-maps"
          strategy="beforeInteractive"
          src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
        />
        
        {/* Yandex.Metrika counter */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(22691407, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true,
                 trackHash:true
            });
            `
          }}
        />
        <noscript><div><img src="https://mc.yandex.ru/watch/22691407" style={{ position: 'absolute', left: '-9999px' }} alt="" /></div></noscript>
        {/* /Yandex.Metrika counter */}
        
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 