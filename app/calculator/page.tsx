'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const marketplaces = ['Wildberries', 'OZON'];

const deliveryTabs = [
  { label: 'до 10 коробок', sublabel: 'сборный груз' },
  { label: '1 паллет', sublabel: 'до 16 коробок' },
  { label: '2 паллета', sublabel: 'до 32 коробок' },
  { label: '3 паллета', sublabel: 'до 48 коробок' },
  { label: '4 паллета', sublabel: 'до 64 коробок' },
  { label: '5 паллет', sublabel: 'до 80 коробок' },
];

const warehouseData: Record<string, Record<number, { name: string; type: string; min: string; price: number; promo?: boolean; active?: boolean }[]>> = {
  Wildberries: {
    0: [
      { name: 'Коледино', type: 'прямая', min: 'от 1 короба', price: 3900, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 1 короба', price: 3900 },
      { name: 'Электросталь', type: 'прямая', min: 'от 1 короба', price: 3900, promo: true },
      { name: 'Обухово', type: 'прямая', min: 'от 1 короба', price: 4500 },
      { name: 'Тула', type: 'прямая', min: 'от 1 короба', price: 8000 },
      { name: 'Чашниково', type: 'прямая', min: 'от 1 короба', price: 8000 },
      { name: 'Казань', type: 'прямая', min: 'от 1 короба', price: 8500 },
      { name: 'Краснодар', type: 'прямая', min: 'от 1 короба', price: 12000 },
      { name: 'Невинномысск', type: 'прямая', min: 'от 1 короба', price: 13400 },
      { name: 'Екатеринбург', type: 'прямая', min: 'от 1 короба', price: 15000 },
    ],
    1: [
      { name: 'Коледино', type: 'прямая', min: 'от 1 паллета', price: 5900, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 1 паллета', price: 5900 },
      { name: 'Электросталь', type: 'прямая', min: 'от 1 паллета', price: 5900, promo: true },
      { name: 'Обухово', type: 'прямая', min: 'от 1 паллета', price: 7000 },
      { name: 'Тула', type: 'прямая', min: 'от 1 паллета', price: 12000 },
      { name: 'Казань', type: 'прямая', min: 'от 1 паллета', price: 14000 },
      { name: 'Краснодар', type: 'прямая', min: 'от 1 паллета', price: 18000 },
      { name: 'Екатеринбург', type: 'прямая', min: 'от 1 паллета', price: 22000 },
    ],
    2: [
      { name: 'Коледино', type: 'прямая', min: 'от 2 паллетов', price: 9800, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 2 паллетов', price: 9800 },
      { name: 'Обухово', type: 'прямая', min: 'от 2 паллетов', price: 13000 },
      { name: 'Казань', type: 'прямая', min: 'от 2 паллетов', price: 24000 },
      { name: 'Краснодар', type: 'прямая', min: 'от 2 паллетов', price: 32000 },
    ],
    3: [
      { name: 'Коледино', type: 'прямая', min: 'от 3 паллетов', price: 13500, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 3 паллетов', price: 13500 },
      { name: 'Казань', type: 'прямая', min: 'от 3 паллетов', price: 34000 },
    ],
    4: [
      { name: 'Коледино', type: 'прямая', min: 'от 4 паллетов', price: 17000, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 4 паллетов', price: 17000 },
    ],
    5: [
      { name: 'Коледино', type: 'прямая', min: 'от 5 паллетов', price: 20000, active: true },
      { name: 'Подольск', type: 'прямая', min: 'от 5 паллетов', price: 20000 },
    ],
  },
  OZON: {
    0: [
      { name: 'Хоругвино', type: 'прямая', min: 'от 1 короба', price: 4500, active: true },
      { name: 'Истра', type: 'прямая', min: 'от 1 короба', price: 4500 },
      { name: 'Казань', type: 'прямая', min: 'от 1 короба', price: 9000 },
      { name: 'Краснодар', type: 'прямая', min: 'от 1 короба', price: 13000 },
    ],
    1: [
      { name: 'Хоругвино', type: 'прямая', min: 'от 1 паллета', price: 7000, active: true },
      { name: 'Истра', type: 'прямая', min: 'от 1 паллета', price: 7000 },
      { name: 'Казань', type: 'прямая', min: 'от 1 паллета', price: 15000 },
    ],
    2: [
      { name: 'Хоругвино', type: 'прямая', min: 'от 2 паллетов', price: 11000, active: true },
      { name: 'Истра', type: 'прямая', min: 'от 2 паллетов', price: 11000 },
    ],
    3: [{ name: 'Хоругвино', type: 'прямая', min: 'от 3 паллетов', price: 15000, active: true }],
    4: [{ name: 'Хоругвино', type: 'прямая', min: 'от 4 паллетов', price: 18000, active: true }],
    5: [{ name: 'Хоругвино', type: 'прямая', min: 'от 5 паллетов', price: 22000, active: true }],
  },
  'Яндекс.Маркет': {
    0: [
      { name: 'Томилино', type: 'прямая', min: 'от 1 короба', price: 4000, active: true },
      { name: 'Софьино', type: 'прямая', min: 'от 1 короба', price: 4000 },
      { name: 'Казань', type: 'прямая', min: 'от 1 короба', price: 9500 },
    ],
    1: [
      { name: 'Томилино', type: 'прямая', min: 'от 1 паллета', price: 6500, active: true },
      { name: 'Софьино', type: 'прямая', min: 'от 1 паллета', price: 6500 },
    ],
    2: [{ name: 'Томилино', type: 'прямая', min: 'от 2 паллетов', price: 10500, active: true }],
    3: [{ name: 'Томилино', type: 'прямая', min: 'от 3 паллетов', price: 14000, active: true }],
    4: [{ name: 'Томилино', type: 'прямая', min: 'от 4 паллетов', price: 17500, active: true }],
    5: [{ name: 'Томилино', type: 'прямая', min: 'от 5 паллетов', price: 21000, active: true }],
  },
  Lamoda: {
    0: [
      { name: 'Москва (Север)', type: 'прямая', min: 'от 1 короба', price: 5000, active: true },
      { name: 'Москва (Юг)', type: 'прямая', min: 'от 1 короба', price: 5000 },
    ],
    1: [{ name: 'Москва (Север)', type: 'прямая', min: 'от 1 паллета', price: 8000, active: true }],
    2: [{ name: 'Москва (Север)', type: 'прямая', min: 'от 2 паллетов', price: 13000, active: true }],
    3: [{ name: 'Москва (Север)', type: 'прямая', min: 'от 3 паллетов', price: 17000, active: true }],
    4: [{ name: 'Москва (Север)', type: 'прямая', min: 'от 4 паллетов', price: 21000, active: true }],
    5: [{ name: 'Москва (Север)', type: 'прямая', min: 'от 5 паллетов', price: 25000, active: true }],
  },
};

type Service = { id: string; icon?: string; name: string; desc: string; pricePerUnit: number; unit: string };

const defaultServices: Service[] = [
  { id: 'reception', icon: '🏷️', name: 'Приёмка и проверка', desc: 'Пересчёт, визуальная проверка упаковки, поиск низкого коэффициента, фото/видео отчёты', pricePerUnit: 14, unit: 'ед.' },
  { id: 'bubble', icon: '📦', name: 'Упаковка в пупырчатую плёнку', desc: 'Защитная упаковка каждой единицы товара', pricePerUnit: 18, unit: 'ед.' },
  { id: 'marking', icon: '🏷️', name: 'Двойная маркировка', desc: 'Нанесение штрихкодов и этикеток', pricePerUnit: 8, unit: 'ед.' },
  { id: 'box', icon: '📫', name: 'Сборка короба', desc: 'Формирование транспортировочного короба, ШК-поставки', pricePerUnit: 80, unit: 'короб' },
];

export default function CalculatorPage() {
  const [activeMarketplace, setActiveMarketplace] = useState('Wildberries');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState(0);
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

  const warehouses = warehouseData[activeMarketplace]?.[activeTab] ?? [];
  const selectedWarehouseData = warehouses[selectedWarehouse] ?? warehouses[0];

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getServiceCost = (svc: Service) => {
    if (svc.unit === 'короб') return svc.pricePerUnit * boxes;
    return svc.pricePerUnit * units;
  };

  const deliveryCost = selectedWarehouseData?.price ?? 0;
  const servicesCost = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + getServiceCost(s), 0);
  const total = deliveryCost + servicesCost;
  const perUnit = units > 0 ? (total / units) : 0;

  const buildOrderText = () => {
    const svcLines = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => `${s.name}: ${getServiceCost(s).toLocaleString('ru-RU')} ₽`)
      .join(', ');
    return `Здравствуйте! Хочу оформить заявку с калькулятора.\n\nИмя: ${formName}\nТелефон: ${formPhone}\n\nМаркетплейс: ${activeMarketplace}\nДоставка: ${deliveryTabs[activeTab].label}\nСклад: ${selectedWarehouseData?.name ?? '—'} — ${deliveryCost.toLocaleString('ru-RU')} ₽\nЕдиниц товара: ${units}\nКоробов: ${boxes}\nУслуги: ${svcLines || '—'}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽ (${perUnit.toFixed(2)} ₽/ед.)`;
  };

  const sendToTelegram = () =>
    fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formName,
        phone: formPhone,
        marketplace: activeMarketplace,
        delivery: deliveryTabs[activeTab].label,
        warehouse: selectedWarehouseData?.name ?? '—',
        units,
        boxes,
        services: services
          .filter(s => selectedServices.includes(s.id))
          .map(s => ({ name: s.name, cost: getServiceCost(s) })),
        deliveryCost,
        servicesCost,
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
      telegram: `https://t.me/luckybox_orders_bot?text=${encodeURIComponent(text)}`,
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

  const marketplaceHints: Record<string, string> = {
    Wildberries: 'Wildberries: 2 часа ожидания на складе бесплатно, далее 700 ₽/час',
    OZON: 'OZON: ожидание на складе — по тарифу склада',
    'Яндекс.Маркет': 'Яндекс.Маркет: уточняйте условия ожидания на складе',
    Lamoda: 'Lamoda: ожидание на складе — по тарифу склада',
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
            <p className="text-neutral-300 text-lg">Рассчитайте стоимость доставки и обработки товаров для маркетплейсов</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">

        {/* Тарифы на доставку */}
        <motion.section
          className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">Тарифы на доставку</h2>
          <p className="text-neutral-500 text-center mb-6">Выберите маркетплейс и склад для расчёта</p>

          {/* Marketplace tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {marketplaces.map(mp => (
              <button
                key={mp}
                onClick={() => { setActiveMarketplace(mp); setActiveTab(0); setSelectedWarehouse(0); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeMarketplace === mp
                    ? 'bg-gold-200 text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {mp}
              </button>
            ))}
          </div>

          {/* Hint */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm text-neutral-700">
            <span className="font-semibold text-gold-400">{activeMarketplace}:</span>{' '}
            {marketplaceHints[activeMarketplace]}
          </div>

          {/* Delivery size tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {deliveryTabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setSelectedWarehouse(0); }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  activeTab === i
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab.label} <span className="opacity-60">({tab.sublabel})</span>
              </button>
            ))}
          </div>

          {/* Warehouse table */}
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600">Склад</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600 hidden sm:table-cell">Тип</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-600 hidden md:table-cell">Мин. кол-во</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-600">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((wh, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedWarehouse(i)}
                    className={`cursor-pointer border-t border-neutral-100 transition-colors ${
                      selectedWarehouse === i ? 'bg-yellow-50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${selectedWarehouse === i ? 'bg-gold-300' : 'bg-neutral-300'}`} />
                      {wh.name}
                      {wh.promo && (
                        <span className="ml-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Акция</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500 hidden sm:table-cell">{wh.type}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500 hidden md:table-cell">{wh.min}</td>
                    <td className="px-4 py-3 text-sm font-bold text-neutral-900 text-right">
                      {wh.price.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

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
                <div className="flex justify-between text-sm text-neutral-300">
                  <span>Доставка ({selectedWarehouseData?.name ?? '—'}):</span>
                  <span className="font-medium text-white">{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                </div>
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
                    <div className="flex justify-between"><span>{activeMarketplace}, {selectedWarehouseData?.name}</span><span className="font-medium">{deliveryCost.toLocaleString('ru-RU')} ₽</span></div>
                    <div className="flex justify-between"><span>Услуги</span><span className="font-medium">{servicesCost.toLocaleString('ru-RU')} ₽</span></div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900"><span>Итого</span><span>{total.toLocaleString('ru-RU')} ₽</span></div>
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
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 6.5h-2.25A1.25 1.25 0 0 0 13 9.75v.75h3.5l-.5 2H13V18h-2v-5.5H9.5v-2H11v-.75A3.25 3.25 0 0 1 14.25 6.5H16.5v2z"/></svg>
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
