"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowsInLineHorizontal, Truck, Package, ShoppingCart, Cube, CaretRight } from '@phosphor-icons/react';
import React from 'react';

// Импорт компонентов и утилит
import { Icons } from '../components/Icons';

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
    title: "Полный комплекс фулфилмента",
    subtitle: "Все операции по обработке заказов под ключ",
    description: "Полный цикл услуг по обработке заказов — от приема товара на склад до доставки конечному покупателю. Мы берем на себя все процессы, связанные с обработкой заказов, позволяя вам сосредоточиться на развитии бизнеса.",
    features: [
      "Приемка и хранение товаров",
      "Обработка заказов маркетплейсов и вашего интернет-магазина",
      "Комплектация и упаковка заказов",
      "Маркировка товаров",
      "Доставка до конечного потребителя"
    ],
    image: "/gallery/fulfillment-full.jpg",
    icon: Icons.ShoppingCart
  },
  {
    title: "Маркетплейс-фулфилмент",
    subtitle: "Специализированные услуги для работы с маркетплейсами",
    description: "Комплексные решения для работы с Wildberries, Ozon, Яндекс.Маркет и другими торговыми площадками. Мы знаем все требования маркетплейсов и обеспечиваем бесперебойную интеграцию.",
    features: [
      "Подготовка товаров согласно требованиям каждого маркетплейса",
      "Упаковка по стандартам площадок",
      "Маркировка в соответствии с требованиями",
      "Отгрузка на склады маркетплейсов",
      "Обработка возвратов"
    ],
    image: "/gallery/fulfillment-marketplace.jpg",
    icon: Icons.Cube
  },
  {
    title: "Складское хранение",
    subtitle: "Надежное хранение ваших товаров",
    description: "Современный склад с оптимальными условиями хранения для различных категорий товаров. Система управления запасами и регулярная инвентаризация обеспечивают полный контроль над вашими товарами.",
    features: [
      "Ответственное хранение с температурным контролем",
      "Учет и инвентаризация товаров",
      "Ежедневная отчетность о состоянии запасов",
      "Гибкие тарифы хранения",
      "Страхование товаров"
    ],
    image: "/gallery/fulfillment-storage.jpg",
    icon: Icons.Package
  }
];

// Преимущества услуги
const advantages = [
  {
    title: "Экономия времени",
    description: "Освободите ресурсы для развития вашего бизнеса",
    icon: Icons.Package
  },
  {
    title: "Снижение затрат",
    description: "Оптимизация расходов на логистику и персонал",
    icon: Icons.CheckCircle
  },
  {
    title: "Масштабируемость",
    description: "Легко справляемся с сезонными пиками и ростом заказов",
    icon: Icons.Globe
  },
  {
    title: "Оперативность",
    description: "Выполняем заказы от единичных до крупных промышленных партий",
    icon: Icons.Truck
  }
];

export default function FulfillmentPage() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <main className="min-h-screen bg-neutral-50 overflow-x-hidden">
      {/* Hero секция */}
      <section className="relative overflow-hidden h-[70vh]">
        <motion.div 
          className="absolute inset-0"
          style={{ y: parallaxY }}
        >
          <Image
            src="/gallery/fulfillment-hero.jpg"
            alt="Фулфилмент"
            width={1920}
            height={1080}
            quality={90}
            className="object-cover brightness-50 w-full h-full"
            priority
          />
        </motion.div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gold-200 p-4 rounded-full mb-6 inline-flex"
          >
            <ShoppingCart size={48} weight="bold" className="text-black" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Услуги фулфилмента
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-neutral-200 max-w-3xl"
          >
            Комплексные решения по обработке и доставке товаров, включая упаковку, хранение и распределение
          </motion.p>
        </div>
      </section>

      {/* Описание услуги */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Надежные услуги фулфилмента</h2>
              <p className="text-lg text-neutral-700">
                Наша компания предлагает полный комплекс услуг фулфилмента для вашего бизнеса.
                Мы берем на себя все логистические операции — от получения товара до доставки
                конечному потребителю, позволяя вам сконцентрироваться на развитии бизнеса.
              </p>
            </div>
          </AnimatedItem>

          {/* Типы фулфилмента */}
          <div className="space-y-24">
            {serviceTypes.map((service, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}>
                <motion.div 
                  className="w-full lg:w-1/2"
                  variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
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
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gold-200">
                      <service.icon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-lg font-medium text-gold-500 mb-4">{service.subtitle}</p>
                  <p className="text-neutral-700 mb-6">{service.description}</p>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold mb-4">Особенности и преимущества:</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1 w-3 h-3 bg-gold-200 rounded-full flex-shrink-0"></span>
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
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Почему выбирают нас</h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                Мы предлагаем высококачественный фулфилмент и индивидуальный подход к каждому клиенту
              </p>
            </div>
          </AnimatedItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <AnimatedItem key={index} delay={index * 100}>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="p-3 rounded-lg bg-gold-200 inline-flex mb-4">
                    <advantage.icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                  <p className="text-neutral-600">{advantage.description}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-gold-100 to-gold-50 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">Готовы обсудить ваш проект?</h2>
                <p className="text-lg text-neutral-700 mb-8">
                  Свяжитесь с нами, чтобы получить индивидуальное предложение для вашего бизнеса.
                  Мы подберем оптимальное решение под ваши задачи.
                </p>
                <Link
                  href="/contacts"
                  className="inline-flex items-center bg-gold-200 hover:bg-gold-300 text-black font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-fit"
                >
                  <span>Связаться с нами</span>
                  <CaretRight weight="bold" className="ml-2" />
                </Link>
              </div>
              <div className="md:w-1/2 relative min-h-[300px]">
                <Image
                  src="/gallery/contact-cta.jpg"
                  alt="Связаться с нами"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 