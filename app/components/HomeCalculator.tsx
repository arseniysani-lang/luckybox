'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLeadModal } from './LeadModalContext';

type Service = { id: string; icon?: string; name: string; desc?: string; pricePerUnit: number; unit: string; categoryId?: string };

const PER_UNIT_UNITS = ['ед.', 'шт.', 'лист'];

const fallbackServices: Service[] = [
  { id: 'reception', icon: '📋', name: 'Приёмка и проверка', pricePerUnit: 14, unit: 'ед.' },
  { id: 'bubble', icon: '📦', name: 'Упаковка в пупырчатую плёнку', pricePerUnit: 18, unit: 'ед.' },
  { id: 'marking', icon: '🏷️', name: 'Двойная маркировка', pricePerUnit: 8, unit: 'ед.' },
  { id: 'box', icon: '📫', name: 'Сборка короба', pricePerUnit: 80, unit: 'короб' },
];

export default function HomeCalculator() {
  const [units, setUnits] = useState(1000);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [selected, setSelected] = useState<string[]>(['reception', 'marking']);
  const { openLeadModal } = useLeadModal();

  useEffect(() => {
    fetch(`/calculator-services.json?_=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { services?: Service[] }) => {
        if (data.services?.length) {
          setServices(data.services.slice(0, 6));
          setSelected([]);
        }
      })
      .catch(() => {});
  }, []);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const getCost = (svc: Service) => {
    const qty = PER_UNIT_UNITS.includes(svc.unit) ? units : 1;
    return svc.pricePerUnit * qty;
  };

  const activeServices = services.filter(s => selected.includes(s.id));
  const total = activeServices.reduce((sum, s) => sum + getCost(s), 0);
  const perUnit = units > 0 ? total / units : 0;

  return (
    <section className="py-16 md:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-amber-100">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Онлайн-расчёт
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Калькулятор фулфилмента</h2>
          <p className="text-neutral-500">Выберите услуги и узнайте стоимость прямо сейчас</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Левая колонка: ввод количества + карточки услуг */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Количество единиц товара</label>
              <input
                type="number"
                min={1}
                value={units}
                onChange={e => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
              <p className="text-xs text-neutral-400 mt-1.5">Для коробов и паллет укажите количество на карточке услуги</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-neutral-700 mb-1">Услуги обработки</h3>
              <p className="text-xs text-neutral-400 mb-4">Нажмите на карточку чтобы выбрать услугу</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc, i) => {
                  const isSelected = selected.includes(svc.id);
                  return (
                    <motion.div
                      key={svc.id}
                      onClick={() => toggle(svc.id)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all select-none ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {svc.icon && <span className="text-base flex-shrink-0">{svc.icon}</span>}
                          <span className="text-sm font-semibold text-neutral-900 leading-tight">{svc.name}</span>
                        </div>
                        <span className="text-amber-500 font-bold text-sm whitespace-nowrap flex-shrink-0">
                          {svc.pricePerUnit} ₽/{svc.unit}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-amber-200 flex justify-between text-xs text-neutral-600">
                          <span>{PER_UNIT_UNITS.includes(svc.unit) ? `${units} ${svc.unit}` : `1 ${svc.unit}`}</span>
                          <span className="font-semibold">{getCost(svc).toLocaleString('ru-RU')} ₽</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Правая колонка: итоговая сумма */}
          <div>
            <motion.div
              className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm sticky top-28"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h3 className="text-sm font-semibold text-neutral-500 mb-4 uppercase tracking-wide">Предварительный расчёт</h3>

              {activeServices.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-neutral-400 text-sm">Выберите услуги слева</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {activeServices.map(svc => (
                    <div key={svc.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600 truncate mr-2">{svc.name}</span>
                      <span className="font-semibold text-neutral-900 whitespace-nowrap">{getCost(svc).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                  <div className="border-t border-neutral-100 pt-3 mt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-neutral-900">Итого</span>
                      <span className="text-xl font-bold text-amber-500">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    {units > 0 && total > 0 && (
                      <p className="text-xs text-neutral-400 mt-1 text-right">{perUnit.toFixed(2)} ₽ за единицу</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Link
                  href="/calculator"
                  className="block w-full text-center py-3 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl transition-colors text-sm"
                >
                  Рассчитать точно →
                </Link>
                <button
                  onClick={openLeadModal}
                  className="block w-full text-center py-2.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-xl transition-colors text-sm"
                >
                  Получить расчёт от менеджера
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
