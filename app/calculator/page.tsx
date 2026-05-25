'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = { id: string; name: string; icon: string };
type Service = { id: string; icon?: string; name: string; desc: string; pricePerUnit: number; unit: string; categoryId?: string };

const defaultServices: Service[] = [
  { id: 'reception', icon: '📋', name: 'Приёмка и проверка', desc: 'Пересчёт, визуальная проверка упаковки, фото/видео отчёты', pricePerUnit: 14, unit: 'ед.' },
  { id: 'bubble', icon: '📦', name: 'Упаковка в пупырчатую плёнку', desc: 'Защитная упаковка каждой единицы товара', pricePerUnit: 18, unit: 'ед.' },
  { id: 'marking', icon: '🏷️', name: 'Двойная маркировка', desc: 'Нанесение штрихкодов и этикеток на товар', pricePerUnit: 8, unit: 'ед.' },
  { id: 'box', icon: '📫', name: 'Сборка короба', desc: 'Формирование транспортировочного короба, ШК-поставки', pricePerUnit: 80, unit: 'короб' },
];

const defaultCategories: Category[] = [];

export default function CalculatorPage() {
  const [units, setUnits] = useState(1000);
  const [boxes, setBoxes] = useState(10);
  const [selectedServices, setSelectedServices] = useState<string[]>(['reception', 'marking']);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/calculator-services.json?_=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { categories?: Category[]; services?: Service[] }) => {
        if (data.services?.length) {
          setServices(data.services);
          setSelectedServices([]);
        }
        if (data.categories?.length) {
          setCategories(data.categories);
          setActiveCategory('all');
        }
      })
      .catch(() => {});
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getServiceCost = (svc: Service) =>
    svc.unit === 'короб' ? svc.pricePerUnit * boxes : svc.pricePerUnit * units;

  const visibleServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.categoryId === activeCategory);

  const activeServices = services.filter(s => selectedServices.includes(s.id));
  const total = activeServices.reduce((sum, s) => sum + getServiceCost(s), 0);
  const perUnit = units > 0 ? total / units : 0;

  const getCategoryIcon = (catId: string) =>
    categories.find(c => c.id === catId)?.icon ?? '';

  const buildOrderText = () => {
    const svcLines = activeServices.map(s => `${s.name}: ${getServiceCost(s).toLocaleString('ru-RU')} ₽`).join(', ');
    return `Здравствуйте! Хочу оформить заявку с калькулятора.\n\nИмя: ${formName}\nТелефон: ${formPhone}\n\nЕдиниц товара: ${units}\nКоробов: ${boxes}\nУслуги: ${svcLines || '—'}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽ (${perUnit.toFixed(2)} ₽/ед.)`;
  };

  const sendToTelegram = () =>
    fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formName, phone: formPhone, units, boxes,
        services: activeServices.map(s => ({ name: s.name, cost: getServiceCost(s) })),
        servicesCost: total, total, perUnit: perUnit.toFixed(2),
      }),
    }).catch(() => {});

  const handleMessenger = async (messenger: 'telegram' | 'whatsapp' | 'max' | 'email') => {
    if (!formName.trim() || !formPhone.trim()) return;
    setSending(true);
    const text = buildOrderText();
    sendToTelegram();
    const links: Record<string, string> = {
      telegram: `https://t.me/LUCKY_BOX_COPACKING?text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/79933361405?text=${encodeURIComponent(text)}`,
      max: `https://max.ru/+79933361405?text=${encodeURIComponent(text)}`,
      email: `mailto:info@luckybox.su?subject=${encodeURIComponent('Заявка с калькулятора')}&body=${encodeURIComponent(text)}`,
    };
    window.open(links[messenger], '_blank');
    setSent(true);
    setFormName('');
    setFormPhone('');
    setSending(false);
  };

  return (
    <main className="min-h-screen bg-neutral-50">

      {/* Hero */}
      <section className="bg-white border-b border-neutral-100 pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-amber-100">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Онлайн-расчёт
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3 leading-tight">
              Калькулятор<br className="hidden sm:block" /> фулфилмента
            </h1>
            <p className="text-neutral-500 text-lg">Выберите услуги и узнайте стоимость обработки вашего товара</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: inputs + cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* Количество */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Количество товара</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1.5">Единиц товара</label>
                  <input
                    type="number"
                    min={1}
                    value={units}
                    onChange={e => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1.5">Коробов</label>
                  <input
                    type="number"
                    min={1}
                    value={boxes}
                    onChange={e => setBoxes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* Услуги с категориями */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-lg font-bold text-neutral-900 mb-1">Услуги обработки</h2>
              <p className="text-sm text-neutral-400 mb-4">Выберите одну или несколько услуг</p>

              {/* Табы категорий */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === 'all'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Все услуги
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                        activeCategory === cat.id
                          ? 'bg-amber-400 text-neutral-900'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {visibleServices.map(svc => {
                    const selected = selectedServices.includes(svc.id);
                    const cost = getServiceCost(svc);
                    const catIcon = svc.icon ?? getCategoryIcon(svc.categoryId ?? '');
                    return (
                      <motion.div
                        key={svc.id}
                        onClick={() => toggleService(svc.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all select-none ${
                          selected
                            ? 'border-amber-400 bg-amber-50 shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {catIcon && <span className="text-lg">{catIcon}</span>}
                              <span className="font-semibold text-neutral-900 text-sm leading-tight">{svc.name}</span>
                            </div>
                            {svc.desc && (
                              <p className="text-xs text-neutral-400 mb-2 leading-relaxed">{svc.desc}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-amber-500 font-bold text-sm">{svc.pricePerUnit} ₽/{svc.unit}</span>
                              {selected && (
                                <span className="text-xs font-semibold text-neutral-600 bg-white rounded-lg px-2 py-0.5 border border-neutral-200">
                                  {cost.toLocaleString('ru-RU')} ₽
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                            selected ? 'border-amber-400 bg-amber-400' : 'border-neutral-300'
                          }`}>
                            {selected && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: sticky summary */}
          <div className="sticky top-24">
            <motion.div
              className="bg-white rounded-2xl shadow-md border border-neutral-100 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-neutral-900 px-6 py-4">
                <h3 className="text-white font-bold text-lg">Ваш расчёт</h3>
                <p className="text-neutral-400 text-xs mt-0.5">{units.toLocaleString('ru-RU')} ед. · {boxes} коробов</p>
              </div>

              <div className="p-6">
                {activeServices.length === 0 ? (
                  <p className="text-neutral-400 text-sm text-center py-4">Выберите услуги слева</p>
                ) : (
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                    {activeServices.map(svc => (
                      <div key={svc.id} className="flex justify-between items-start gap-2">
                        <span className="text-sm text-neutral-600 leading-tight flex-1">{svc.name}</span>
                        <span className="text-sm font-semibold text-neutral-900 whitespace-nowrap">{getServiceCost(svc).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-neutral-100 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-neutral-900">Итого</span>
                    <span className="font-bold text-2xl text-neutral-900">{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">За единицу товара</span>
                    <span className="text-sm font-semibold text-amber-500">{perUnit.toFixed(2)} ₽</span>
                  </div>
                </div>

                {activeServices.length > 0 && (
                  <button
                    onClick={() => setSelectedServices([])}
                    className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2"
                  >
                    Очистить выбор
                  </button>
                )}

                <button
                  onClick={() => { setSent(false); setShowModal(true); }}
                  disabled={activeServices.length === 0}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  Оформить заявку →
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">* Ориентировочные цены. Уточняйте у менеджера.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Модальная форма */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {sent ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-neutral-500 mb-6">Мы свяжемся с вами в ближайшее время.</p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-neutral-900">Оформить заявку</h3>
                    <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none">&times;</button>
                  </div>

                  {/* Краткий итог */}
                  <div className="bg-neutral-50 rounded-xl p-4 mb-5 text-sm space-y-1.5 max-h-40 overflow-y-auto">
                    {activeServices.map(svc => (
                      <div key={svc.id} className="flex justify-between text-neutral-600">
                        <span>{svc.name}</span>
                        <span className="font-medium text-neutral-800">{getServiceCost(svc).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                      <span>Итого</span>
                      <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1.5">Ваше имя</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="Иван Иванов"
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1.5">Телефон</label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={e => setFormPhone(e.target.value)}
                        placeholder="+7 (999) 000-00-00"
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                      />
                    </div>
                    <p className="text-sm text-neutral-400 text-center">Выберите удобный способ связи:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('telegram')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#229ED9] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>
                        Telegram
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('whatsapp')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('max')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2 22l4.997-1.338A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zM7 12A5 5 0 1 0 17 12A5 5 0 1 0 7 12Z"/></svg>
                        Max
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('email')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        Email
                      </button>
                    </div>
                    {(!formName.trim() || !formPhone.trim()) && (
                      <p className="text-xs text-neutral-400 text-center">Заполните имя и телефон чтобы продолжить</p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
