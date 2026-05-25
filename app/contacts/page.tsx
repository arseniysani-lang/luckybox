'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import YandexMap from '../components/YandexMap';
import { Phone, EnvelopeSimple, TelegramLogo, MapPin, Clock, WhatsappLogo } from "@phosphor-icons/react";
import axios from 'axios';
import Link from 'next/link';
import ThankYouModal from '../components/ThankYouModal';

const MaxIcon = ({ size = 24, className = '' }: { size?: number; className?: string; weight?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2 22l4.997-1.338A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zM7 12A5 5 0 1 0 17 12A5 5 0 1 0 7 12Z"
    />
  </svg>
);

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Спасибо!');
  const [modalMessage, setModalMessage] = useState('Мы свяжемся с вами в ближайшее время.');
  const [modalEventType, setModalEventType] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/contact', formData);
      setModalTitle('Спасибо за обращение!');
      setModalMessage('Мы получили ваше сообщение и свяжемся с вами в ближайшее время.');
      setModalEventType('form_submit');
      setIsModalOpen(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setModalTitle('Ошибка');
      setModalMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
      setModalEventType('form_error');
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactClick = (type: string) => {
    setModalTitle('Спасибо за интерес!');
    setModalMessage(`Мы рады, что вы выбрали ${type} для связи с нами. Мы ответим вам в ближайшее время.`);
    setModalEventType(`contact_${type.toLowerCase()}`);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Адрес",
      content: "Московская область, г. Пушкино, микрорайон Полянка, к. 25"
    },
    {
      icon: Phone,
      title: "Телефон",
      content: "+7 993 336 1405",
      link: "tel:+79933361405",
      onClick: () => handleContactClick('phone')
    },
    {
      icon: TelegramLogo,
      title: "Telegram",
      content: "@LUCKY_BOX_COPACKING",
      link: "https://t.me/LUCKY_BOX_COPACKING",
      onClick: () => handleContactClick('telegram')
    },
    {
      icon: WhatsappLogo,
      title: "WhatsApp",
      content: "+7 993 336 1405",
      link: "https://wa.me/79933361405",
      onClick: () => handleContactClick('whatsapp')
    },
    {
      icon: MaxIcon,
      title: "Max",
      content: "+7 993 336 1405",
      link: "https://max.ru/+79933361405",
      onClick: () => handleContactClick('max')
    },
    {
      icon: EnvelopeSimple,
      title: "Email",
      content: "info@luckybox.su",
      link: "mailto:info@luckybox.su"
    },
    {
      icon: Clock,
      title: "Режим работы",
      content: "Пн-Пт: 8:00 - 18:00\nСб-Вс: выходной"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      {/* Hero секция */}
      <section className="relative bg-neutral-900 py-24 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Свяжитесь с нами
          </motion.h1>
          <motion.p 
            className="text-lg text-neutral-300 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Мы готовы ответить на все ваши вопросы и помочь реализовать ваши идеи
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Контактная информация */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">Наши контакты</h2>
            
            <div className="grid gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-gold-200 p-3 rounded-lg">
                    <info.icon size={24} weight="bold" className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{info.title}</h3>
                    {info.link ? (
                      <Link 
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-gold-500 hover:text-gold-600 whitespace-pre-line transition-colors flex items-center"
                        onClick={info.onClick}
                      >
                        {info.content}
                        <svg xmlns="https://www.w3.org/2000/svg" className="w-4 h-4 ml-1.5 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ) : (
                      <p className="text-neutral-600 whitespace-pre-line">{info.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Форма обратной связи */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">Напишите нам</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-gold-200 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-gold-200 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-gold-200 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-gold-200 outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gold-200 text-black py-4 px-6 rounded-lg font-semibold hover:bg-gold-300 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Карта */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Как нас найти</h2>
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <YandexMap />
          </div>
        </div>
      </section>

      {/* Модальное окно */}
      <ThankYouModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        eventType={modalEventType}
      />
    </div>
  );
} 