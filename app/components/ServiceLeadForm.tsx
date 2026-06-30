'use client';

import { useState } from 'react';

export default function ServiceLeadForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    try {
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          units: 0,
          services: [],
          servicesCost: 0,
          total: 0,
          perUnit: '0',
          source: 'Заявка со страницы услуги',
        }),
      });
    } catch {}
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(109407571, 'reachGoal', 'calculator_form_sent');
    }
    setSent(true);
    setSending(false);
  };

  return (
    <section className="py-12 md:py-16 bg-neutral-900">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Узнайте точную стоимость для вашего товара
        </h2>
        <p className="text-neutral-400 mb-8">Оставьте заявку — менеджер свяжется в течение 15 минут</p>

        {sent ? (
          <div className="bg-white rounded-2xl p-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-bold text-neutral-900">Спасибо!</p>
            <p className="text-neutral-600 mt-1">Менеджер свяжется с вами в течение 15 минут</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Имя"
              required
              className="flex-1 border border-neutral-700 bg-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Телефон"
              required
              className="flex-1 border border-neutral-700 bg-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={sending || !name.trim() || !phone.trim()}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {sending ? '...' : 'Получить расчёт'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
