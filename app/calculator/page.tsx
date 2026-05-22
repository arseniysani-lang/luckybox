'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

  useEffect(() => {
    fetch('/calculator-services.json')
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
              <Link
                href="/contacts"
                className="w-full text-center px-6 py-3 border-2 border-gold-200 text-gold-200 font-semibold rounded-xl hover:bg-gold-200 hover:text-neutral-900 transition-colors"
              >
                Оформить заявку →
              </Link>
            </div>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-6">* Цены указаны ориентировочно. Для точного расчёта свяжитесь с нами.</p>
        </motion.section>

      </div>
    </main>
  );
}
