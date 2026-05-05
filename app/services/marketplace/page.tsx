"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Cube, CaretRight } from '@phosphor-icons/react';
import React from 'react';

// Импорт компонентов и утилит
import { Icons } from '../../components/Icons';

// Определение анимаций
const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

// Анимированный компонент
function AnimatedItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}

// Основные разделы услуги
const serviceTypes = [
  {
    title: "Упаковка для Wildberries",
    subtitle: "Профессиональная подготовка товаров для Wildberries",
    description: "Полностью соответствующая требованиям маркетплейса упаковка, включая все необходимые маркировки, этикетки и защитные элементы. Гарантируем прием товара без проблем и штрафов.",
    features: [
      "Упаковка согласно требованиям Wildberries",
      "Маркировка товаров в соответствии со стандартами",
      "Нанесение штрихкодов и QR-кодов",
      "Групповая упаковка для оптимизации поставок",
      "Подготовка сопроводительной документации"
    ],
    bgColor: "from-purple-400 to-indigo-600",
    icon: Icons.Cube
  },
  {
    title: "Упаковка для Ozon",
    subtitle: "Эффективная подготовка товаров для Ozon",
    description: "Профессиональная упаковка продукции с учетом всех требований Ozon, включая маркировку, групповую упаковку и подготовку к отправке на склад маркетплейса.",
    features: [
      "Упаковка в соответствии с правилами Ozon",
      "Маркировка каждой единицы товара",
      "Групповая упаковка для оптимизации логистики",
      "Защита продукции от повреждений при транспортировке",
      "Подготовка товаров для FBS и FBO"
    ],
    bgColor: "from-blue-300 to-blue-600",
    icon: Icons.Cube
  },
  {
    title: "Упаковка для Яндекс.Маркет",
    subtitle: "Качественная подготовка товаров для Яндекс.Маркет",
    description: "Комплексная подготовка продукции для реализации на Яндекс.Маркет, включая все требования по упаковке, маркировке и отгрузке на склады маркетплейса.",
    features: [
      "Упаковка в соответствии с требованиями Яндекс.Маркет",
      "Подготовка индивидуальных и групповых упаковок",
      "Маркировка для корректной идентификации товаров",
      "Защита от повреждений при транспортировке",
      "Учет особенностей разных категорий товаров"
    ],
    bgColor: "from-red-300 to-red-500",
    icon: Icons.Cube
  }
];

// Преимущества услуги
const advantages = [
  {
    title: "Опыт работы",
    description: "Более 5 лет успешной работы с ведущими маркетплейсами",
    icon: Icons.CheckCircle
  },
  {
    title: "Соответствие требованиям",
    description: "Полное соответствие актуальным требованиям каждого маркетплейса",
    icon: Icons.CheckCircle
  },
  {
    title: "Экономия времени",
    description: "Освобождение ваших ресурсов для развития бизнеса",
    icon: Icons.Package
  },
  {
    title: "Исключение штрафов",
    description: "Защита от штрафов и отказов в приеме товара",
    icon: Icons.Globe
  }
];

export default function MarketplacePage() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <main className="min-h-screen bg-neutral-50 overflow-x-hidden">
      {/* Hero секция */}
      <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600"
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
            <Cube size={36} weight="bold" className="text-black md:w-12 md:h-12" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6"
          >
            Упаковка продукции для маркетплейсов
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-neutral-200 max-w-3xl"
          >
            Профессиональная упаковка товаров согласно требованиям площадок, включая Wildberries, Ozon и Яндекс.Маркет
          </motion.p>
        </div>
      </section>

      {/* Описание услуги */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Упаковка товаров для маркетплейсов</h2>
              <p className="text-base md:text-lg text-neutral-700">
                Наша компания предлагает профессиональные услуги по упаковке продукции для ведущих 
                маркетплейсов России. Мы знаем все тонкости и требования каждой площадки и обеспечиваем
                полное соответствие вашей продукции этим стандартам.
              </p>
            </div>
          </AnimatedItem>

          {/* Виды упаковки для маркетплейсов */}
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
                Мы гарантируем высокое качество упаковки и соответствие всем требованиям маркетплейсов
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
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-sky-600 to-indigo-700 relative overflow-hidden">
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
              Готовы обсудить упаковку ваших товаров?
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-neutral-200 mb-6 md:mb-10"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Свяжитесь с нами для получения консультации и расчета стоимости услуг
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
    </main>
  );
} 