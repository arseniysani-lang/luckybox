'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Icons } from './components/Icons';
import RollingGallery from './components/RollingGallery';
import YandexMap from './components/YandexMap';
import { useState, useEffect, useRef } from 'react';
import { useLeadModal } from './components/LeadModalContext';

// Интерфейсы для типизации
interface IconProps {
  className?: string;
}

interface AdvantageItem {
  title: string;
  description: string;
  icon: React.FC<IconProps>;
  gradient: string;
}

// Анимации для элементов
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

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Новые анимации без мерцания
const smoothFadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0],
  }
};

const smoothScaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0],
  }
};

// Новые 3D анимации
const cardReveal = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: 10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
};

const fadeSlideUp = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggeredFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Простые и надежные анимации без мерцания
const simpleAppear = {
  opacity: 0,
  y: 30,
  transition: {
    type: "tween",
    duration: 0.5,
    ease: "easeOut"
  }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Стили для анимированной линии
const lineAnimation = {
  initial: {
    background: "linear-gradient(90deg, transparent 0%, var(--gold-200) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "100% 0"
  },
  animate: {
    backgroundPosition: ["100% 0", "0% 0", "-100% 0"],
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Хук для анимации появления элементов
function useAppearAnimation() {
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

  return { ref, isVisible };
}

// Компонент для анимированного появления
function AnimatedItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useAppearAnimation();

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

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const { openLeadModal } = useLeadModal();

  // Следим за скроллом для кнопки "наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Функция для плавного скролла наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Функция для скролла к элементу с учетом высоты навбара
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Обработка хэш-ссылок при загрузке страницы
  useEffect(() => {
    const handleHashNavigation = () => {
      const { hash } = window.location;
      if (hash) {
        // Небольшая задержка для корректной загрузки страницы
        setTimeout(() => {
          scrollToElement(hash.substring(1));
        }, 300);
      }
    };

    // Вызываем функцию при монтировании компонента
    handleHashNavigation();

    // Слушаем изменения хэша
    window.addEventListener('hashchange', handleHashNavigation, { passive: true });
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 relative">
      {/* Кнопка "Наверх" */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-50 bg-gold-200 p-3 md:p-4 rounded-full shadow-lg hover:bg-gold-300 transition-all duration-300 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Прокрутить наверх"
      >
        <Icons.ArrowUp className="w-5 h-5 md:w-7 md:h-7" />
      </motion.button>

      {/* Hero секция с параллакс эффектом */}
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: parallaxY }}
        >
          <Image
            src="/gallery/background1_2.png"
            alt="Warehouse background"
            width={1920}
            height={1080}
            quality={85}
            className="object-cover brightness-50 w-full h-full"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 min-h-screen flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 -ml-11 hover:scale-105 transition-transform duration-300"
          >
            <Image
              src="/logo.webp"
              alt="LuckyBox Logo"
              width={350}
              height={350}
              className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-auto"
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 350px"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=="
            />
          </motion.div>
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Упаковка и фулфилмент
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Полный цикл работ по упаковыванию различного вида товаров и услуги фулфилмента
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link
              href="/calculator"
              className="px-6 md:px-8 py-3.5 bg-gold-200 text-black rounded-lg font-semibold hover:bg-gold-300 transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base"
            >
              Рассчитать стоимость за 2 минуты
            </Link>
            <button
              onClick={openLeadModal}
              className="px-6 md:px-8 py-3.5 bg-white/10 border border-white/40 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm md:text-base backdrop-blur-sm"
            >
              Получить уникальный расчёт
            </button>
          </motion.div>
        </div>
      </section>

      {/* О нас - расширенная версия */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            О компании LuckyBox
          </motion.h2>

          {/* Изменение структуры макета - фотография становится фоном для верхней части */}
          <motion.div
            className="relative rounded-2xl overflow-hidden mb-12 shadow-xl"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <div className="relative h-[250px] md:h-[300px] w-full">
              <Image
                src="/gallery/photo2.png"
                alt="Компания LuckyBox"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 max-w-3xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Компания LuckyBox</h3>
                <p className="text-lg text-white/90 bg-black/30 p-4 rounded-lg backdrop-blur-sm">
                  Предоставляет комплексные услуги фулфилмента и упаковки товаров по территории России c 2007 года.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Информационные блоки - двухколоночная структура */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div
              className="space-y-6"
              variants={fadeInLeft}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <div className="text-lg text-gray-700 space-y-5">
                <div className="bg-neutral-50 p-5 rounded-lg border-l-4 border-gold-300 shadow-sm">
                  <p>Современный производственный комплекс, расположен в Московской области, обеспечивая обработку до <span className="font-semibold text-gold-500">15 000 заказов</span> ежедневно. Доставка осуществляется по всей России.</p>
                </div>

                <div className="p-5 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">
                    <span className="text-gold-400">LuckyBox</span> предлагает полный цикл фулфилмент-услуг, включая:
                  </p>
                  <ul className="list-none space-y-2">
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center mr-3">
                        <span className="text-gold-500 text-sm">✓</span>
                      </div>
                      приемку и хранение
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center mr-3">
                        <span className="text-gold-500 text-sm">✓</span>
                      </div>
                      комплектацию и упаковку
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center mr-3">
                        <span className="text-gold-500 text-sm">✓</span>
                      </div>
                      доставку товаров
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={fadeInRight}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <div className="bg-neutral-50 p-5 rounded-lg border-l-4 border-gold-300 shadow-sm">
              <p className="text-lg text-gray-700">
                  Компания работает с крупнейшими маркетплейсами: <span className="font-semibold">Wildberries, Ozon, Яндекс.Маркет и МегаМаркет</span>, работая по моделям FBO и FBS.
              </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '15+', label: 'лет опыта' },
                  { value: '1000+', label: 'довольных клиентов' },
                  { value: '24/7', label: 'поддержка' },
                  { value: '100%', label: 'гарантия качества' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-gold-100 hover:shadow-lg transition-shadow duration-300"
                    variants={scaleIn}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-gold-400 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Этапы работы */}
      <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/gallery/pattern.png')] opacity-5 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              Как мы работаем
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute top-1/2 left-0 right-0 h-0.5"
              initial="initial"
              animate="animate"
              variants={lineAnimation}
              style={{
                "--gold-200": "#ffd700"
              } as any}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {[
                {
                  step: '01',
                  title: 'Консультация',
                  description: 'Обсуждаем ваши задачи, отвечаем на вопросы и определяем потребности',
                  Icon: Icons.Team,
                  link: '/contacts'
                },
                {
                  step: '02',
                  title: 'Расчет стоимости',
                  description: 'Анализируем задачу и предоставляем оптимальное коммерческое предложение',
                  Icon: Icons.Mark,
                  link: '/contacts'
                },
                {
                  step: '03',
                  title: 'Оформление',
                  description: 'Согласовываем условия и подписываем договор о сотрудничестве',
                  Icon: Icons.Print,
                  link: '/contacts'
                },
                {
                  step: '04',
                  title: 'Реализация',
                  description: 'Принимаем товар и начинаем выполнение поставленных задач',
                  Icon: Icons.Package,
                  link: '/contacts'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative perspective-1000 h-full"
                  initial={{ opacity: 0, rotateY: -50, translateZ: -200 }}
                  whileInView={{
                    opacity: 1,
                    rotateY: 0,
                    translateZ: 0,
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 100,
                      delay: index * 0.2
                    }
                  }}
                  whileHover={{
                    transform: "translateY(-8px) rotate(1deg)",
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true }}
                >
                  {item.link ? (
                    <Link href={item.link} className="block h-full">
                      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                        group hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-500
                        hover:bg-gradient-to-b hover:from-white hover:to-neutral-50 relative overflow-hidden h-full cursor-pointer">

                        {/* Декоративный фоновый элемент */}
                        <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-br from-gold-200/20 to-gold-300/20
                          rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        {/* Номер этапа */}
                        <div className="absolute top-6 right-6">
                          <div className="text-6xl font-black text-neutral-100 group-hover:text-gold-200/20 transition-colors duration-500">
                            {item.step}
                          </div>
                        </div>

                        {/* Иконка */}
                        <motion.div
                          className="relative z-10 mb-8"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-gold-200 to-gold-300
                            rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500
                            flex items-center justify-center shadow-lg">
                            <item.Icon className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>

                        {/* Контент */}
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>

                        {/* Декоративная линия */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent
                          via-gold-200 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>
                    </Link>
                  ) : (
                  <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                    group hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-500
                    hover:bg-gradient-to-b hover:from-white hover:to-neutral-50 relative overflow-hidden h-full">

                    {/* Декоративный фоновый элемент */}
                    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-br from-gold-200/20 to-gold-300/20
                      rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                    {/* Номер этапа */}
                    <div className="absolute top-6 right-6">
                      <div className="text-6xl font-black text-neutral-100 group-hover:text-gold-200/20 transition-colors duration-500">
                        {item.step}
                      </div>
                    </div>

                    {/* Иконка */}
                    <motion.div
                      className="relative z-10 mb-8"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-200 to-gold-300
                        rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500
                        flex items-center justify-center shadow-lg">
                        <item.Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Контент */}
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>

                    {/* Декоративная линия */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent
                      via-gold-200 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Наши преимущества - уникальный дизайн */}
      <section id="why-us" className="py-20 md:py-32 bg-gradient-to-br from-white via-neutral-50 to-gold-50 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] -right-[400px] -top-[400px] bg-gradient-to-br from-gold-200/10 to-gold-300/5 rounded-full blur-3xl"></div>
          <div className="absolute w-[600px] h-[600px] -left-[300px] -bottom-[300px] bg-gradient-to-tr from-gold-200/10 to-gold-300/5 rounded-full blur-3xl"></div>
          <div className="absolute w-full h-40 bg-gradient-to-r from-gold-200/5 via-gold-300/10 to-gold-200/5 -skew-y-3 top-64 transform-gpu"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 md:px-6 py-2 bg-gradient-to-r from-gold-200 to-gold-300 text-black rounded-full mb-4 font-medium shadow-md text-sm md:text-base">
              НАШИ ПРЕИМУЩЕСТВА
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-800 via-gold-600 to-gray-800 bg-clip-text text-transparent">Почему выбирают нас</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Многолетний опыт и современные технологии позволяют нам обеспечивать высочайшее качество упаковки
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Комплексные фулфилмент-услуги',
                description: 'Мы предоставляем полный цикл услуг: от приемки и хранения товаров до комплектации, упаковки и доставки. Обрабатываем до 15 000 заказов в сутки!',
                icon: Icons.Truck,
                color: 'from-gold-200 to-gold-300'
              },
              {
                title: 'Мы работаем по России',
                description: 'Мы предоставляем услуги по территории России, гарантируя быструю и надежную доставку.',
                icon: Icons.Globe,
                color: 'from-gold-300 to-amber-400'
              },
              {
                title: 'Высокий уровень контроля',
                description: 'Автоматизированная система контроля качества с 7-ступенчатой проверкой гарантирует соответствие высоким стандартам.',
                icon: Icons.CheckCircle,
                color: 'from-gold-200 to-gold-300'
              },
              {
                title: 'Работаем с крупными агентствами России',
                description: 'Услуги по упаковке POS-материалов, сувенирной продукции и сезонных подарков, обеспечивая высокое качество и индивидуальный подход к каждому проекту.',
                icon: Icons.Globe,
                color: 'from-gold-300 to-amber-400'
              },
              {
                title: 'Сотрудничество с маркетплейсами',
                description: 'Мы активно сотрудничаем с ведущими маркетплейсами, такими как Wildberries, Ozon, МегаМаркет и Яндекс.Маркет, обеспечивая эффективный выход ваших товаров на рынок и максимальную видимость для клиентов.',
                icon: Icons.ShoppingCart,
                color: 'from-gold-200 to-gold-300'
              },
              {
                title: 'Индивидуальный подход',
                description: 'Предлагаем персонализированные решения для вашего бизнеса, включая помощь в выводе товаров на маркетплейсы и согласование условий производства.',
                icon: Icons.Handshake,
                color: 'from-gold-300 to-amber-400'
              }
            ].map((item, index) => {
              // Явное приведение типов для TypeScript
              const typedItem: AdvantageItem = {
                title: item.title,
                description: item.description,
                icon: item.icon,
                gradient: item.color
              };

              return (
              <motion.div
                key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }
                  }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                viewport={{ once: true }}
                  className="h-full group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden border border-gold-100 transform-gpu">
                    <div className="p-8">
                      <div className="flex flex-col items-center mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${typedItem.gradient} flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300 mb-4`}>
                          <typedItem.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 text-center group-hover:text-gold-500 transition-colors duration-300">{typedItem.title}</h3>
                      </div>
                      <p className="text-gray-600">{typedItem.description}</p>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="py-16 md:py-24 bg-white relative">
        <div className="absolute inset-0 bg-[url('/gallery/back.png')] opacity-40 bg-cover bg-center"></div>

        {/* Декоративные элементы для фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Круги */}
          <div className="absolute w-[600px] h-[600px] -right-[200px] top-[5%] bg-gradient-to-br from-gold-200/15 to-gold-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] -left-[150px] top-[30%] bg-gradient-to-tr from-gold-200/15 to-gold-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Волнистые линии */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1000 1000" xmlns="https://www.w3.org/2000/svg">
            <path d="M0,200 Q250,250 500,200 T1000,200" fill="none" stroke="#FFD700" strokeWidth="3" />
            <path d="M0,400 Q250,450 500,400 T1000,400" fill="none" stroke="#FFD700" strokeWidth="3" />
            <path d="M0,600 Q250,650 500,600 T1000,600" fill="none" stroke="#FFD700" strokeWidth="3" />
            <path d="M0,800 Q250,850 500,800 T1000,800" fill="none" stroke="#FFD700" strokeWidth="3" />
          </svg>

          {/* Точки */}
          <div className="absolute inset-0 bg-[radial-gradient(#FFD700_1.5px,transparent_1.5px)] bg-[length:25px_25px] opacity-15"></div>

          {/* Иконки услуг в фоне */}
          <div className="absolute top-[15%] right-[10%] text-gold-200/20 transform rotate-12">
            <Icons.Package className="w-24 md:w-48 h-24 md:h-48" />
          </div>
          <div className="absolute bottom-[20%] left-[5%] text-gold-200/20 transform -rotate-12">
            <Icons.Truck className="w-28 md:w-56 h-28 md:h-56" />
          </div>
          <div className="absolute top-[60%] right-[15%] text-gold-200/20">
            <Icons.Cube className="w-20 md:w-40 h-20 md:h-40" />
          </div>
          <div className="absolute top-[40%] left-[20%] text-gold-200/15 transform rotate-45">
            <Icons.Mark className="w-16 md:w-32 h-16 md:h-32" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedItem>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Наши услуги</h2>
              <p className="text-gray-600 mb-10 md:mb-16 max-w-3xl mx-auto text-sm md:text-base">
                Предоставляем полный спектр услуг по упаковке товаров. Если в списке нет необходимой вам услуги, свяжитесь с нами, и мы обсудим индивидуальное решение.
              </p>
            </div>
          </AnimatedItem>

          {/* Основные услуги */}
          <div className="space-y-12 mb-16">
            {[
              {
                icon: Icons.Package,
                title: "Сборка наборов любой сложности",
                description: "Профессиональная сборка подарочных и промо-наборов различной сложности",
                items: [
                  "Подарочных наборов",
                  "Промо-наборов",
                  "Препаков"
                ],
                link: '/services/gift-sets'
              },
              {
                icon: Icons.Mark,
                title: "Маркировка",
                description: "Нанесение этикеток, штрихкодов и стикеров на различные типы товаров",
                items: [
                  "Штучного товара",
                  "Наборов",
                  "Коробов",
                  "Паллет",
                  "Промо-продуктов"
                ],
                link: '/services/marking'
              },
              {
                icon: Icons.Shrink,
                title: "Термоусадка",
                description: "Применение термоусадочной технологии для защиты и группировки товаров",
                items: [
                  "Штучного товара",
                  "Наборов",
                  "Коробов"
                ],
                link: '/services/shrink-wrap'
              },
              {
                icon: Icons.ShoppingCart,
                title: "Услуги фулфилмента",
                description: "Полный цикл услуг для выхода на маркетплейсы: от приемки до отгрузки",
                items: [
                  "Wildberries",
                  "Ozon",
                  "Яндекс.Маркет",
                  "МегаМаркет"
                ],
                link: '/services/fulfillment'
              },
              {
                icon: Icons.Cube,
                title: "Образцы и пробники",
                description: "Производство и упаковка образцов и пробников для маркетинговых целей",
                items: [
                  "Формирование наборов образцов",
                  "Упаковку пробников",
                  "Маркировку образцов"
                ],
                link: '/services/samples'
              },
              {
                icon: Icons.CheckCircle,
                title: "Услуги для маркетплейсов",
                description: "Подготовка товаров к размещению на маркетплейсах",
                items: [
                  "Подготовку товаров",
                  "Оформление поставок",
                  "Маркировку"
                ],
                link: '/services/marketplace'
              }
            ].map((service, index) => (
              <AnimatedItem key={index} delay={index * 100}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 items-center`}>
                  <div className="w-full md:w-1/2">
                    <div className="bg-gradient-to-br from-gold-200/20 to-gold-300/20 rounded-xl md:rounded-2xl aspect-video flex items-center justify-center">
                      <service.icon className="w-20 md:w-32 h-20 md:h-32 text-gold-400" />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-lg bg-gold-200">
                        <service.icon className="w-5 h-5 md:w-7 md:h-7 text-black" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-neutral-700 mb-4">{service.description}</p>
                    <div className="bg-neutral-50 p-4 rounded-lg md:rounded-xl mb-4 md:mb-6">
                      <h4 className="text-base font-semibold mb-2 md:mb-3">Что включает:</h4>
                      <ul className="space-y-1.5 md:space-y-2">
                        {service.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm md:text-base">
                            <span className="w-2 h-2 bg-gold-200 rounded-full flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={service.link}
                        className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gold-200 text-black rounded-lg font-medium hover:bg-gold-300 transition-colors text-sm md:text-base"
                      >
                        Подробнее
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                  </div>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </section>

      {/* Наши партнеры */}
      <section className="py-16 md:py-24 bg-neutral-50 relative overflow-hidden">
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] -right-[300px] -top-[300px] bg-gradient-to-br from-gold-200/5 to-gold-300/5 rounded-full blur-3xl"></div>
          <div className="absolute w-[400px] h-[400px] -left-[200px] -bottom-[200px] bg-gradient-to-tr from-gold-200/5 to-gold-300/5 rounded-full blur-3xl"></div>

          {/* Волнистые линии */}
          <svg className="absolute bottom-0 left-0 w-full h-40 opacity-10" viewBox="0 0 1000 200" xmlns="https://www.w3.org/2000/svg">
            <path d="M0,100 Q250,150 500,100 T1000,100" fill="none" stroke="#FFD700" strokeWidth="2" />
            <path d="M0,50 Q250,100 500,50 T1000,50" fill="none" stroke="#FFD700" strokeWidth="2" />
            <path d="M0,150 Q250,200 500,150 T1000,150" fill="none" stroke="#FFD700" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 md:px-6 py-2 bg-gradient-to-r from-gold-200 to-gold-300 text-black rounded-full mb-3 md:mb-4 font-medium shadow-md text-sm md:text-base">
              НАШИ ПАРТНЕРЫ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-6">Мы работаем с маркетплейсами</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Официальное партнерство с ведущими маркетплейсами позволяет нам обеспечивать эффективную интеграцию и оптимальные условия для наших клиентов
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {[
              {
                name: 'Ozon',
                color: 'from-blue-500/10 to-blue-600/5',
                description: 'Один из крупнейших маркетплейсов России'
              },
              {
                name: 'Wildberries',
                color: 'from-purple-500/10 to-purple-600/5',
                description: 'Лидирующий онлайн-ритейлер России'
              },
              {
                name: 'Яндекс.Маркет',
                color: 'from-yellow-500/10 to-yellow-600/5',
                description: 'Популярный сервис для покупок'
              },
              {
                name: 'МегаМаркет',
                color: 'from-red-500/10 to-red-600/5',
                description: 'Быстрорастущая торговая площадка'
              }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true }}
                className="h-full"
              >
                <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden border border-gold-100 p-4 md:p-6 flex flex-col items-center text-center group`}>
                  <div className={`w-full h-16 md:h-20 mb-3 md:mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br ${partner.color} p-3 group-hover:scale-105 transition-transform duration-300`}>
                    <div className="text-lg md:text-xl font-bold text-gray-700">{partner.name}</div>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm">{partner.description}</p>
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-3 md:mt-4"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Отзывы клиентов */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 md:px-6 py-2 bg-gradient-to-r from-gold-200 to-gold-300 text-black rounded-full mb-3 font-medium shadow-md text-sm md:text-base">
              ОТЗЫВЫ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Что говорят клиенты</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Алексей М.',
                role: 'Продавец WB, товары для кухни',
                text: 'Работаем с LuckyBox уже 8 месяцев. Отличная скорость обработки — заказы уходят день в день. Цены честные, ничего лишнего не насчитывают. Рекомендую.',
              },
              {
                name: 'Светлана К.',
                role: 'Бренд косметики, Ozon',
                text: 'Наконец нашли надёжного партнёра для маркировки и упаковки. Стартовали за 2 дня, никаких задержек. Менеджер всегда на связи — это дорогого стоит.',
              },
              {
                name: 'Дмитрий Р.',
                role: 'Поставщик Яндекс.Маркет',
                text: 'Перешли от другого ФФ из-за брака при упаковке. Здесь — ноль рекламаций за 5 месяцев. Склад чистый, процессы выстроены. Будем работать дальше.',
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gold-100 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">{review.text}</p>
                <div className="border-t border-neutral-100 pt-4">
                  <p className="font-semibold text-neutral-900">{review.name}</p>
                  <p className="text-xs text-neutral-500">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Готовы обсудить ваш проект?</h2>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Свяжитесь с нами, и мы поможем реализовать ваши идеи наилучшим образом
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/calculator"
                  className="inline-block px-6 md:px-8 py-2 md:py-3 bg-gold-200 text-black rounded-lg font-medium hover:bg-gold-300 transition-all duration-300 hover:shadow-lg text-sm md:text-base"
                >
                  Рассчитать стоимость
                </Link>
              </motion.div>
              <motion.button
                onClick={openLeadModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-2 md:py-3 border-2 border-neutral-200 text-neutral-700 rounded-lg font-medium hover:border-gold-300 hover:text-gold-500 transition-all duration-300 text-sm md:text-base"
              >
                Получить уникальный расчёт
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Карта */}
      <motion.section
        className="relative bg-white"
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <div className="h-[400px]">
          <YandexMap />
        </div>
      </motion.section>
    </main>
  );
}
