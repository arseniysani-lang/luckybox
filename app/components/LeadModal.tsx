'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LeadModal({ isOpen, onClose }: Props) {
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
          source: 'Заявка «Получить КП» с сайта',
        }),
      });
    } catch {}
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(109407571, 'reachGoal', 'calculator_form_sent');
    }
    setSent(true);
    setSending(false);
  };

  const handleClose = () => {
    if (sending) return;
    setSent(false);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 relative"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X size={22} weight="bold" />
            </button>

            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Спасибо!</h3>
                <p className="text-neutral-600">Менеджер свяжется с вами в течение 15 минут</p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2.5 bg-amber-400 text-neutral-900 font-semibold rounded-xl hover:bg-amber-500 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1">Получить КП бесплатно</h2>
                <p className="text-neutral-500 text-sm mb-6">Ответим в течение 15 минут в рабочее время</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Имя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ваше имя"
                      required
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent placeholder-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      required
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent placeholder-neutral-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending || !name.trim() || !phone.trim()}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Отправляем...' : 'Отправить заявку'}
                  </button>
                </form>
                <p className="text-xs text-neutral-400 text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
