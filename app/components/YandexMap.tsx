'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Создаем Observer для lazy-loading карты
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const initMap = () => {
    if (typeof window !== 'undefined' && window.ymaps && !isMapLoaded) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map('map', {
        center: [55.960175, 37.895349], // координаты Пушкино
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
      });

      const placemark = new window.ymaps.Placemark(
        [55.960175, 37.895349],
        {
          balloonContent: `
            <div class="p-4">
              <h3 class="font-bold mb-2">LuckyBox</h3>
              <p class="text-sm">Производство упаковки</p>
              <p class="text-sm text-neutral-600 mt-2">г. Пушкино, микрорайон Полянка, к. 25</p>
              <p class="text-sm text-neutral-600">Тел: +7 993 336 1405</p>
              <p class="text-sm text-neutral-600">Telegram: @LUCKY_BOX_COPACKING</p>
            </div>
          `
        },
        {
          preset: 'islands#goldDotIcon'
        }
      );

      map.geoObjects.add(placemark);
      map.behaviors.disable('scrollZoom');
        setIsMapLoaded(true);
      });
      }
    };

  return (
    <div className="relative h-full">
    <div 
        ref={mapRef} 
      id="map" 
        className="w-full h-full"
      >
        {!isVisible && (
          <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
            <div className="text-gray-500">Карта загружается...</div>
          </div>
        )}
      </div>

      {isVisible && (
        <Script
          src="https://api-maps.yandex.ru/2.1/?apikey=14b27c0d-0cbf-49c5-a97c-af4db4c35bcf&lang=ru_RU"
          strategy="lazyOnload"
          onLoad={initMap}
        />
      )}
    </div>
  );
} 