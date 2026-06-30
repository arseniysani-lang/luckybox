'use client';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Barcode } from "@phosphor-icons/react";
import { Icons } from '../../components/Icons';
import ServiceLeadForm from '../../components/ServiceLeadForm';

// Анимации
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

// Компонент для анимированного появления
function AnimatedItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Основные разделы услуги
const serviceTypes = [
  {
    title: "Маркировка штучного товара",
    subtitle: "Индивидуальная маркировка каждой единицы продукции",
    description: "Профессиональная маркировка отдельных товаров с учетом всех требований законодательства и торговых площадок. Наносим этикетки, штрих-коды и другие идентификаторы на любые виды продукции.",
    features: [
      "Маркировка товаров согласно требованиям Честного ЗНАКа",
      "Нанесение штрихкодов и QR-кодов",
      "Печать и нанесение этикеток с информацией о товаре",
      "Маркировка различных типов материалов и поверхностей",
      "Интеграция с учетными системами"
    ],
    bgColor: "from-stone-300 to-amber-400",
    icon: Icons.Mark
  },
  {
    title: "Маркировка наборов",
    subtitle: "Комплексное решение для групповых товаров",
    description: "Создаем и наносим маркировку на наборы из нескольких товаров. Учитываем все требования к маркировке комплектов, обеспечивая корректное отображение информации о составе и характеристиках набора.",
    features: [
      "Комплексная маркировка наборов с учетом всех компонентов",
      "Создание групповой упаковки с нанесением маркировки",
      "Соблюдение требований маркетплейсов к наборам",
      "Маркировка промо-наборов и подарочных комплектов",
      "Дополнительная защитная маркировка"
    ],
    bgColor: "from-orange-200 to-orange-400",
    icon: Icons.Package
  },
  {
    title: "Маркировка коробов и паллет",
    subtitle: "Решения для оптовых партий и логистики",
    description: "Профессиональное нанесение маркировки на групповую тару, короба и паллеты. Обеспечиваем соответствие требованиям логистических компаний и складов для быстрой идентификации и отслеживания грузов.",
    features: [
      "Маркировка транспортной тары согласно ГОСТам",
      "Нанесение логистических этикеток для складов и маркетплейсов",
      "Паллетная маркировка для оптовых поставок",
      "Маркировка групповой упаковки штрих-кодами и QR-кодами",
      "Создание и нанесение инвентарных этикеток"
    ],
    bgColor: "from-neutral-500 to-neutral-700",
    icon: Icons.Warehouse
  },
  {
    title: "Маркировка промо-продуктов",
    subtitle: "Специализированные решения для маркетинговых материалов",
    description: "Разрабатываем и наносим маркировку на промо-материалы и рекламную продукцию. Соблюдаем требования к идентификации рекламных материалов и обеспечиваем их правильный учет.",
    features: [
      "Маркировка рекламных материалов и сувенирной продукции",
      "Нанесение уникальных кодов для промо-акций",
      "Маркировка промо-образцов и тестеров",
      "Создание этикеток с информацией о рекламных акциях",
      "Брендированная маркировка для маркетинговых материалов"
    ],
    bgColor: "from-purple-300 to-purple-500",
    icon: Icons.Additional
  }
];

// Преимущества работы с нами
const advantages = [
  {
    title: "Современное оборудование",
    description: "Используем высокотехнологичное оборудование для точного нанесения маркировки",
    icon: Icons.CheckCircle
  },
  {
    title: "Соответствие требованиям",
    description: "Все работы выполняются с учетом требований законодательства и торговых площадок",
    icon: Icons.Globe
  },
  {
    title: "Интеграция с ИС МП",
    description: "Работаем с системой маркировки Честный ЗНАК и обеспечиваем корректную регистрацию",
    icon: Icons.ShoppingCart
  },
  {
    title: "Масштабируемость",
    description: "Маркируем партии любого объема - от единичных изделий до крупных оптовых поставок",
    icon: Icons.Cube
  }
];

export default function MarkingPage() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <main className="min-h-screen bg-neutral-50 overflow-x-hidden">
      {/* Hero секция */}
      <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600"
          style={{ y: parallaxY }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gold-200 p-3 md:p-4 rounded-full mb-4 md:mb-6 inline-flex"
          >
            <Barcode size={36} weight="bold" className="text-black md:w-12 md:h-12" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6"
          >
            Маркировка
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-neutral-200 max-w-3xl"
          >
            Профессиональная маркировка товаров для соответствия законодательству и требованиям маркетплейсов
          </motion.p>
        </div>
      </section>

      {/* Описание услуги */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Комплексные услуги маркировки</h2>
              <p className="text-base md:text-lg text-neutral-700">
                Наша компания предоставляет полный спектр услуг по маркировке товаров
                от штучной продукции до коробов и паллет. Работаем с системой Честный ЗНАК
                и обеспечиваем соответствие всем требованиям маркетплейсов и ритейлеров.
              </p>
            </div>
          </AnimatedItem>

          {/* Типы маркировки */}
          <div className="space-y-16 md:space-y-24">
            {serviceTypes.map((service, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 md:gap-8 lg:gap-16 items-center`}>
                <motion.div 
                  className="w-full lg:w-1/2"
                  variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                >
                  <div className={`relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg aspect-video bg-gradient-to-br ${service.bgColor}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.createElement(service.icon, { className: "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 text-white/70" })}
                    </div>
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="w-full lg:w-1/2"
                  variants={index % 2 === 0 ? fadeInRight : fadeInLeft}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="p-2 md:p-3 rounded-lg bg-gold-200">
                      {React.createElement(service.icon, { className: "w-6 h-6 md:w-8 md:h-8 text-black" })}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-base md:text-lg font-medium text-gold-500 mb-3 md:mb-4">{service.subtitle}</p>
                  <p className="text-sm md:text-base text-neutral-700 mb-4 md:mb-6">{service.description}</p>
                  
                  <div className="bg-neutral-50 p-4 md:p-6 rounded-lg md:rounded-xl">
                    <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Особенности и преимущества:</h4>
                    <ul className="space-y-2 md:space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base">
                          <span className="mt-1 w-2 md:w-3 h-2 md:h-3 bg-gold-200 rounded-full flex-shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Наши преимущества */}
      <section className="py-12 md:py-16 lg:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Почему выбирают нас</h2>
              <p className="text-base md:text-lg text-neutral-700 max-w-3xl mx-auto">
                Мы предлагаем полный комплекс услуг по маркировке товаров с использованием современных технологий
                и профессионального оборудования
              </p>
            </div>
          </AnimatedItem>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {advantages.map((advantage, index) => (
              <AnimatedItem key={index} delay={index * 100}>
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="p-2 md:p-3 rounded-lg bg-gold-200 inline-flex mb-3 md:mb-4">
                    {React.createElement(advantage.icon, { className: "w-5 md:w-6 lg:w-7 h-5 md:h-6 lg:h-7 text-black" })}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{advantage.title}</h3>
                  <p className="text-sm md:text-base text-neutral-600">{advantage.description}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-amber-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-pattern-grid"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              Готовы обсудить маркировку вашей продукции?
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-neutral-200 mb-6 md:mb-10"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Свяжитесь с нами для получения консультации и расчета стоимости услуг маркировки
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                href="/contacts" 
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gold-200 text-black rounded-lg font-medium hover:bg-gold-300 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-sm md:text-base"
              >
                Связаться с нами
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <ServiceLeadForm />
    </main>
  );
} 