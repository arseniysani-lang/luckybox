'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Service = { id: string; icon?: string; name: string; desc: string; pricePerUnit: number; unit: string };

const defaultServices: Service[] = [
  { id: 'reception', icon: '🏷️', name: 'Приёмка и проверка', desc: 'Пересчёт, визуальная проверка упаковки, поиск низкого коэффициента, фото/видео отчёты', pricePerUnit: 14, unit: 'ед.' },
  { id: 'bubble', icon: '📦', name: 'Упаковка в пупырчатую плёнку', desc: 'Защитная упаковка каждой единицы товара', pricePerUnit: 18, unit: 'ед.' },
  { id: 'marking', icon: '🏷️', name: 'Двойная маркировка', desc: 'Нанесение штрихкодов и этикеток', pricePerUnit: 8, unit: 'ед.' },
  { id: 'box', icon: '📫', name: 'Сборка короба', desc: 'Формирование транспортировочного короба, ШК-поставки', pricePerUnit: 80, unit: 'короб' },
];

export default function CalculatorPage() {
  const [units, setUnits] = useState(1000);
  const [boxes, setBoxes] = useState(10);
  const [selectedServices, setSelectedServices] = useState<string[]>(['reception', 'marking']);
  const [services, setServices] = useState<Service[]>(defaultServices);

  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    fetch(`/calculator-services.json?_=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { services?: Service[] }) => {
        if (data.services?.length) {
          setServices(data.services);
          setSelectedServices(prev => {
            const valid = prev.filter(id => data.services!.some(s => s.id === id));
            return valid.length > 0 ? valid : data.services!.slice(0, 1).map(s => s.id);
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getServiceCost = (svc: Service) => {
    if (svc.unit === 'короб') return svc.pricePerUnit * boxes;
    return svc.pricePerUnit * units;
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + getServiceCost(s), 0);
  const perUnit = units > 0 ? (total / units) : 0;

  const buildOrderText = () => {
    const svcLines = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => `${s.name}: ${getServiceCost(s).toLocaleString('ru-RU')} ₽`)
      .join(', ');
    return `Здравствуйте! Хочу оформить заявку с калькулятора.\n\nИмя: ${formName}\nТелефон: ${formPhone}\n\nЕдиниц товара: ${units}\nКоробов: ${boxes}\nУслуги: ${svcLines || '—'}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽ (${perUnit.toFixed(2)} ₽/ед.)`;
  };

  const sendToTelegram = () =>
    fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formName,
        phone: formPhone,
        units,
        boxes,
        services: services
          .filter(s => selectedServices.includes(s.id))
          .map(s => ({ name: s.name, cost: getServiceCost(s) })),
        servicesCost: total,
        total,
        perUnit: perUnit.toFixed(2),
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
      <section className="bg-neutral-800 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-neutral-700 text-gold-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
              </svg>
              Онлайн-расчёт
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Калькулятор фулфилмента</h1>
            <p className="text-neutral-300 text-lg">Рассчитайте стоимость обработки товаров для маркетплейсов</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">

        {/* Услуги обработки */}
        <motion.section
          className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">Услуги обработки</h2>
          <p className="text-neutral-500 text-center mb-8">Выберите необходимые услуги</p>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Количество единиц товара</label>
              <input
                type="number"
                min={1}
                value={units}
                onChange={e => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Количество коробов</label>
              <input
                type="number"
                min={1}
                value={boxes}
                onChange={e => setBoxes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-200"
              />
            </div>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(svc => {
              const selected = selectedServices.includes(svc.id);
              const cost = getServiceCost(svc);
              return (
                <div
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    selected ? 'border-gold-200 bg-yellow-50' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 mb-1">{svc.name}</div>
                      <div className="text-xs text-neutral-500 mb-3">{svc.desc}</div>
                      <div className="text-gold-400 font-bold text-sm">{svc.pricePerUnit} ₽ / {svc.unit}</div>
                      {selected && (
                        <div className="text-xs text-neutral-500 mt-1">
                          {svc.pricePerUnit} ₽ × {svc.unit === 'короб' ? boxes : units} {svc.unit === 'короб' ? 'коробов' : 'ед.'} = <span className="font-semibold text-neutral-800">{cost.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ml-3 flex items-center justify-center transition-colors ${
                      selected ? 'border-gold-300 bg-gold-200' : 'border-neutral-300'
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                          <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Итоговый расчёт */}
        <motion.section
          className="bg-neutral-800 rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-4">Итоговый расчёт</h2>
              <div className="space-y-2">
                {services.filter(s => selectedServices.includes(s.id)).map(svc => (
                  <div key={svc.id} className="flex justify-between text-sm text-neutral-300">
                    <span>{svc.name}:</span>
                    <span className="font-medium text-white">{getServiceCost(svc).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-neutral-600 flex justify-between">
                  <span className="text-white font-semibold">Всего:</span>
                  <span className="text-gold-200 font-bold text-xl">{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-gold-200 rounded-xl px-8 py-4 text-center">
                <div className="text-xs font-medium text-neutral-700 mb-1">Стоимость за единицу товара</div>
                <div className="text-2xl font-bold text-neutral-900">{perUnit.toFixed(2)} ₽</div>
              </div>
              <button
                onClick={() => { setSent(false); setSendError(false); setShowModal(true); }}
                className="w-full text-center px-6 py-3 border-2 border-gold-200 text-gold-200 font-semibold rounded-xl hover:bg-gold-200 hover:text-neutral-900 transition-colors"
              >
                Оформить заявку →
              </button>
            </div>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-6">* Цены указаны ориентировочно. Для точного расчёта свяжитесь с нами.</p>
        </motion.section>

      </div>

      {/* Модальная форма заявки */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
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
                    className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-neutral-900">Оформить заявку</h3>
                    <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none">&times;</button>
                  </div>

                  {/* Краткий итог */}
                  <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-sm text-neutral-600 space-y-1">
                    {services.filter(s => selectedServices.includes(s.id)).map(svc => (
                      <div key={svc.id} className="flex justify-between">
                        <span>{svc.name}</span>
                        <span className="font-medium">{getServiceCost(svc).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                      <span>Итого</span>
                      <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1">Ваше имя</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="Иван Иванов"
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1">Телефон</label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={e => setFormPhone(e.target.value)}
                        placeholder="+7 (999) 000-00-00"
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                    <p className="text-sm text-neutral-500 text-center">Выберите удобный способ связи:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('telegram')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#229ED9] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>
                        Telegram
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('whatsapp')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('max')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2 22l4.997-1.338A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zM7 12A5 5 0 1 0 17 12A5 5 0 1 0 7 12Z"/></svg>
                        Max
                      </button>
                      <button
                        disabled={sending || !formName.trim() || !formPhone.trim()}
                        onClick={() => handleMessenger('email')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-700 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
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
