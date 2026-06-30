'use client';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowsInLineHorizontal } from "@phosphor-icons/react";
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
    title: "Штучная термоусадка",
    subtitle: "Индивидуальная упаковка отдельных товаров",
    description: "Профессиональная термоусадка отдельных изделий для обеспечения их сохранности, защиты от повреждений и улучшения презентабельного вида. Используем только качественные материалы, обеспечивающие надежную защиту и прозрачность.",
    features: [
      "Защита от внешних воздействий и загрязнений",
      "Сохранение товарного вида изделия",
      "Применение различных типов термоусадочной пленки",
      "Возможность нанесения маркировки перед термоусадкой",
      "Индивидуальный подход к каждому типу товара"
    ],
    bgColor: "from-blue-300 to-teal-400",
    icon: Icons.Shrink
  },
  {
    title: "Групповая термоусадка",
    subtitle: "Упаковка нескольких товаров в единую группу",
    description: "Формирование групп товаров в единую упаковку с помощью термоусадочных технологий. Идеально подходит для набора товаров, мультипаков и оптовых упаковок. Обеспечивает удобство транспортировки и хранения продукции.",
    features: [
      "Формирование наборов и мультипаков",
      "Улучшение логистических показателей",
      "Возможность создания групп различной конфигурации",
      "Удобство хранения и транспортировки",
      "Защита от несанкционированного доступа"
    ],
    bgColor: "from-indigo-300 to-indigo-500",
    icon: Icons.Package
  },
  {
    title: "Палетная термоусадка",
    subtitle: "Защита паллет с товарами",
    description: "Упаковка целых паллет термоусадочной пленкой для обеспечения максимальной защиты при транспортировке и хранении. Надежно фиксирует груз на паллете и защищает его от внешних воздействий, влаги и пыли.",
    features: [
      "Защита от влаги и пыли",
      "Фиксация груза на паллете",
      "Предотвращение хищений и повреждений",
      "Устойчивость к механическим воздействиям",
      "Улучшение складского хранения"
    ],
    bgColor: "from-cyan-600 to-blue-800",
    icon: Icons.Warehouse
  }
];

// Преимущества работы с нами
const advantages = [
  {
    title: "Современное оборудование",
    description: "Используем высокотехнологичное оборудование для качественной термоусадки",
    icon: Icons.CheckCircle
  },
  {
    title: "Качественные материалы",
    description: "Работаем только с проверенными материалами, гарантирующими надежность упаковки",
    icon: Icons.Cube
  },
  {
    title: "Экономичность",
    description: "Оптимизируем расход материалов и предлагаем конкурентные цены",
    icon: Icons.ShoppingCart
  },
  {
    title: "Любые объемы",
    description: "Выполняем заказы от единичных изделий до крупных промышленных партий",
    icon: Icons.Truck
  }
];

export default function ShrinkWrapPage() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <main className="min-h-screen bg-neutral-50 overflow-x-hidden">
      {/* Hero секция */}
      <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600"
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
            <ArrowsInLineHorizontal size={36} weight="bold" className="text-black md:w-12 md:h-12" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6"
          >
            Термоусадка
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-neutral-200 max-w-3xl"
          >
            Применение термоусадочной технологии для защиты и группировки товаров
          </motion.p>
        </div>
      </section>

      {/* Описание услуги */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Профессиональная термоусадка</h2>
              <p className="text-base md:text-lg text-neutral-700">
                Наша компания предлагает услуги термоусадки различных товаров с использованием
                современного оборудования и качественных материалов. Термоусадка позволяет защитить
                товары от внешних воздействий, улучшить их презентабельность и оптимизировать логистику.
              </p>
            </div>
          </AnimatedItem>

          {/* Типы термоусадки */}
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
                Мы предлагаем полный спектр услуг по термоусадке с использованием профессионального оборудования
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

      {/* Информация о материалах */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedItem>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Используемые материалы</h2>
              <p className="text-lg text-neutral-700">
                Для термоусадки мы используем только качественные материалы, проверенные временем
              </p>
            </div>
          </AnimatedItem>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="bg-neutral-50 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">ПВХ-пленка</h3>
              <p className="text-neutral-700 mb-4">
                Отличается высокой прозрачностью и глянцем. Идеально подходит для упаковки товаров, требующих презентабельного внешнего вида.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Толщина от 15 до 100 мкм</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Высокая прозрачность</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Отличные барьерные свойства</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-50 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">ПОФ-пленка</h3>
              <p className="text-neutral-700 mb-4">
                Полиолефиновая пленка обладает повышенной прочностью и устойчивостью к внешним воздействиям. Экологически безопасна.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Толщина от 12 до 25 мкм</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Экологически безопасна</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Высокая прочность</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-50 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">Термоусадочные пакеты</h3>
              <p className="text-neutral-700 mb-4">
                Готовые термоусадочные пакеты различных размеров для быстрой и удобной упаковки товаров. Оптимальны для средних и малых партий.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Различные размеры и форматы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Удобство использования</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                  <span className="text-sm">Возможность печати на пакетах</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
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
              Готовы заказать услуги термоусадки?
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
      <ServiceLeadForm />
    </main>
  );
} 