import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Phone, EnvelopeSimple, TelegramLogo, X, Copy, Check, NotePencil, WhatsappLogo } from "@phosphor-icons/react";
import { useRouter } from 'next/navigation';

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async (text: string, key: string) => {
    if (!isMounted) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Для современных браузеров
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      // Показываем индикатор успешного копирования
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const contactOptions = [
    {
      icon: NotePencil,
      label: 'Оставить заявку',
      action: () => router.push('/contacts'),
      color: 'bg-gold-200',
      isLink: true,
      href: '/contacts'
    },
    {
      icon: Phone,
      label: '+7 993 336 1405',
      value: '+79933361405',
      color: 'bg-emerald-500',
      isLink: true,
      href: 'tel:+79933361405'
    },
    {
      icon: TelegramLogo,
      label: 'Telegram',
      color: 'bg-blue-500',
      isLink: true,
      href: 'https://t.me/luckybox_orders_bot'
    },
    {
      icon: WhatsappLogo,
      label: 'WhatsApp',
      color: 'bg-green-500',
      isLink: true,
      href: 'https://wa.me/79933361405'
    },
    {
      icon: EnvelopeSimple,
      label: 'info@luckybox.su',
      value: 'info@luckybox.su',
      color: 'bg-red-500',
      isLink: true,
      href: 'mailto:info@luckybox.su'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 w-72"
              >
                <div className="space-y-3">
                  {contactOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`${option.color} p-2 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <option.icon size={20} weight="bold" className="text-white" />
                      </div>
                      {option.isLink ? (
                        <Link 
                          href={option.href || '/contacts'}
                          target={option.href?.startsWith('http') ? '_blank' : undefined}
                          rel={option.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-neutral-700 text-sm font-medium flex-grow hover:text-gold-300 transition-colors flex items-center truncate max-w-[170px]"
                        >
                          {option.label}
                          {option.href?.startsWith('http') && (
                            <svg xmlns="https://www.w3.org/2000/svg" className="w-3.5 h-3.5 ml-1 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </Link>
                      ) : (
                        <>
                          <span className="text-neutral-700 text-sm font-medium flex-grow truncate">{option.label}</span>
                          <motion.button
                            onClick={() => option.value && handleCopy(option.value, index.toString())}
                            className="text-neutral-400 hover:text-gold-300 transition-colors flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {copiedStates[index.toString()] ? (
                              <Check size={20} weight="bold" className="text-emerald-500" />
                            ) : (
                              <Copy size={20} weight="bold" />
                            )}
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`${
              isOpen ? 'bg-neutral-900' : 'bg-gold-200'
            } h-14 rounded-full shadow-lg flex items-center justify-center gap-3 px-6 group transition-colors duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <>
                <X size={24} weight="bold" className="text-white" />
                <span className="text-white font-medium">Закрыть</span>
              </>
            ) : (
              <>
                <Phone 
                  size={24} 
                  weight="bold" 
                  className="text-neutral-900 group-hover:scale-110 transition-transform" 
                />
                <span className="text-neutral-900 font-medium whitespace-nowrap">Связаться с нами</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 