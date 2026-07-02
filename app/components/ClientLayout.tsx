'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import ContactButton from './ContactButton';
import LeadModal from './LeadModal';
import { LeadModalContext } from './LeadModalContext';
import { List, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  useEffect(() => {
    const scrollToSection = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
          requestAnimationFrame(() => {
            const offset = 100;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          });
        }
      }
    };

    if (window.location.hash) {
      setTimeout(scrollToSection, 300);
    }

    window.addEventListener('hashchange', scrollToSection, { passive: true });
    return () => window.removeEventListener('hashchange', scrollToSection);
  }, []);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.hasAttribute('data-nav-link')) {
        e.preventDefault();

        const hash = link.getAttribute('data-hash');

        if (hash) {
          if (window.location.pathname !== '/') {
            window.location.href = `/${hash}`;
            return;
          }

          const targetElement = document.getElementById(hash.substring(1));
          if (targetElement) {
            const offset = 100;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { passive: false });

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, link: { href: string, hash?: string }) => {
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (link.hash) {
      e.preventDefault();

      const targetId = link.hash.substring(1);

      setIsMobileMenuOpen(false);

      if (window.location.pathname !== '/') {
        router.push(`/${link.hash}`);

        clickTimeoutRef.current = setTimeout(() => {
          isNavigatingRef.current = false;
        }, 800);
        return;
      }

      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const offset = 100;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }

        clickTimeoutRef.current = setTimeout(() => {
          isNavigatingRef.current = false;
        }, 800);
      }, 300);
    } else {
      router.push(link.href);
      setIsMobileMenuOpen(false);

      clickTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 800);
    }
  }, [router]);

  const navLinks = [
    { href: '/', label: 'Наши услуги', hash: '#services' },
    { href: '/', label: 'О компании', hash: '#about' },
    { href: '/', label: 'Преимущества', hash: '#why-us' }
  ];

  return (
    <LeadModalContext.Provider value={{ openLeadModal: () => setShowLeadModal(true) }}>
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b bg-neutral-900/60 backdrop-blur-sm border-neutral-800/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
            {/* Логотип и текст */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.webp"
                  alt="LuckyBox Logo"
                  width={90}
                  height={90}
                  className="w-[70px] h-[60px] md:w-[85px] md:h-[72px] lg:w-[95px] lg:h-[80px] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  loading="eager"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 70px, (max-width: 768px) 85px, 95px"
                  quality={90}
                />
                <div className="ml-3 hidden xl:block">
                  <div className="text-white text-xs font-medium whitespace-nowrap">Профессиональные решения</div>
                  <div className="text-neutral-200 text-xs whitespace-nowrap">для упаковки вашей продукции</div>
                </div>
              </Link>
            </div>

            {/* Навигационное меню */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                  <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
                </svg>
                <Link
                  href="/"
                  data-nav-link="true"
                  data-hash="#services"
                  className="text-sm font-medium text-white hover:text-gold-200 transition-colors whitespace-nowrap"
                  onClick={(e) => handleNavigation(e, { href: '/', hash: '#services' })}
                >
                  Наши услуги
                </Link>
              </div>

              <div className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                  <path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
                </svg>
                <Link
                  href="/"
                  data-nav-link="true"
                  data-hash="#about"
                  className="text-sm font-medium text-white hover:text-gold-200 transition-colors whitespace-nowrap"
                  onClick={(e) => handleNavigation(e, { href: '/', hash: '#about' })}
                >
                  О компании
                </Link>
              </div>

              <div className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4"/>
                </svg>
                <Link
                  href="/"
                  data-nav-link="true"
                  data-hash="#how-it-works"
                  className="text-sm font-medium text-white hover:text-gold-200 transition-colors whitespace-nowrap"
                  onClick={(e) => handleNavigation(e, { href: '/', hash: '#how-it-works' })}
                >
                  Как это работает
                </Link>
              </div>

              <div className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                </svg>
                <Link
                  href="/"
                  data-nav-link="true"
                  data-hash="#why-us"
                  className="text-sm font-medium text-white hover:text-gold-200 transition-colors whitespace-nowrap"
                  onClick={(e) => handleNavigation(e, { href: '/', hash: '#why-us' })}
                >
                  Преимущества
                </Link>
              </div>

              <div className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors cursor-pointer whitespace-nowrap">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-1 13H5V7h14v9zM7 9h2v2H7zm0 4h2v2H7zm4-4h6v2h-6zm0 4h6v2h-6z"/>
                </svg>
                <Link
                  href="/calculator"
                  className="text-sm font-medium text-white hover:text-gold-200 transition-colors whitespace-nowrap"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Калькулятор
                </Link>
              </div>

              <a
                href="tel:+79933361405"
                className="flex items-center gap-1 text-white hover:text-gold-200 transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M20.487 17.14l-4.065-3.696a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.085-1.39z"></path>
                </svg>
                <span className="text-sm font-medium whitespace-nowrap">+7 993 336-14-05</span>
              </a>

              <button
                onClick={() => setShowLeadModal(true)}
                className="px-4 py-2 bg-gold-200 text-black text-sm font-medium rounded-md hover:bg-gold-300 transition-colors duration-200 flex items-center whitespace-nowrap flex-shrink-0"
              >
                <svg className="w-4 h-4 mr-1.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
                </svg>
                Рассчитать стоимость
              </button>
            </div>

            {/* Мобильная кнопка меню */}
            <motion.button
              className="lg:hidden relative z-50 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-gold-200 shadow-md touch-manipulation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ backgroundColor: "#F5D77B" }}
              animate={{
                backgroundColor: isMobileMenuOpen ? "#333333" : "#F5D77B",
                transition: { duration: 0.3 }
              }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90, color: "#000" }}
                    animate={{ opacity: 1, rotate: 0, color: "#fff" }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} weight="bold" className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-900"
                  >
                    <List size={20} weight="bold" className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-neutral-900/60 backdrop-blur-sm rounded-b-2xl shadow-lg"
            >
              <div className="py-4 space-y-1 px-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                  <Link
                    href="/"
                    data-nav-link="true"
                    data-hash="#services"
                    className="block text-white hover:text-gold-200 transition-colors py-3 px-4 text-sm font-medium rounded hover:bg-neutral-800/50 active:bg-neutral-800/70 touch-manipulation"
                    onClick={(e) => handleNavigation(e, { href: '/', hash: '#services' })}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                        <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                        <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
                      </svg>
                      Услуги
                    </span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
                  <Link
                    href="/"
                    data-nav-link="true"
                    data-hash="#about"
                    className="block text-white hover:text-gold-200 transition-colors py-3 px-4 text-sm font-medium rounded hover:bg-neutral-800/50 active:bg-neutral-800/70 touch-manipulation"
                    onClick={(e) => handleNavigation(e, { href: '/', hash: '#about' })}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                        <path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
                      </svg>
                      О компании
                    </span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.3 }}>
                  <Link
                    href="/"
                    data-nav-link="true"
                    data-hash="#how-it-works"
                    className="block text-white hover:text-gold-200 transition-colors py-3 px-4 text-sm font-medium rounded hover:bg-neutral-800/50 active:bg-neutral-800/70 touch-manipulation"
                    onClick={(e) => handleNavigation(e, { href: '/', hash: '#how-it-works' })}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4"/>
                      </svg>
                      Как это работает
                    </span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
                  <Link
                    href="/"
                    data-nav-link="true"
                    data-hash="#why-us"
                    className="block text-white hover:text-gold-200 transition-colors py-3 px-4 text-sm font-medium rounded hover:bg-neutral-800/50 active:bg-neutral-800/70 touch-manipulation"
                    onClick={(e) => handleNavigation(e, { href: '/', hash: '#why-us' })}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                        <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                      </svg>
                      Преимущества
                    </span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.3 }}>
                  <Link
                    href="/calculator"
                    className="block text-white hover:text-gold-200 transition-colors py-3 px-4 text-sm font-medium rounded hover:bg-neutral-800/50 active:bg-neutral-800/70 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="https://www.w3.org/2000/svg">
                        <path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-1 13H5V7h14v9zM7 9h2v2H7zm0 4h2v2H7zm4-4h6v2h-6zm0 4h6v2h-6z"/>
                      </svg>
                      Калькулятор
                    </span>
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-2 my-3">
                      <Link
                        href="/calculator"
                        className="block w-full text-center px-3 py-4 bg-gold-100 text-black text-sm rounded font-medium hover:bg-gold-200 active:bg-gold-300 transition-colors duration-200 touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Рассчитать стоимость
                      </Link>
                      <button
                        className="block w-full text-center px-3 py-4 bg-gold-400 text-black text-sm rounded font-medium hover:bg-gold-500 active:bg-gold-600 transition-colors duration-200 touch-manipulation"
                        onClick={() => { setIsMobileMenuOpen(false); setShowLeadModal(true); }}
                      >
                        Получить уникальный расчёт
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Основной контент */}
      <div className="min-h-screen bg-neutral-50">
        {children}
      </div>

      <ContactButton />

      <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} />

      {/* Футер */}
      <footer className="bg-white border-t border-neutral-200 py-8 md:py-10 lg:py-12 relative z-10 mt-8 md:mt-10 lg:mt-12 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-gold-300 mb-2 md:mb-3">LuckyBox</h3>
              <p className="text-sm md:text-base text-neutral-600">Профессиональные решения для упаковки вашей продукции</p>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-neutral-900">Услуги</h4>
              <ul className="space-y-2">
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-neutral-900">Компания</h4>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link href="/about" className="text-sm md:text-base text-neutral-600 hover:text-gold-300 transition-colors">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="text-sm md:text-base text-neutral-600 hover:text-gold-300 transition-colors">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-neutral-900">Контакты</h4>
              <p className="text-sm md:text-base text-neutral-600">Email: info@luckybox.su</p>
              <p className="text-sm md:text-base text-neutral-600">Телефон: +7 993 336 1405</p>
              <p className="text-sm md:text-base text-neutral-600">Telegram: @luckybox_orders_bot</p>
              <p className="text-sm md:text-base text-neutral-600">Адрес: микрорайон Полянка, к. 25, г. Пушкино, Московская область</p>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-neutral-200 text-center text-xs md:text-sm text-neutral-600">
            <p>&copy; 2025 LuckyBox. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </LeadModalContext.Provider>
  );
}
