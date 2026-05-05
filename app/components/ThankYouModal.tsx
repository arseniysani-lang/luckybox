import { motion, AnimatePresence } from 'framer-motion';
import { X } from "@phosphor-icons/react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  eventType?: string;
}

export default function ThankYouModal({ isOpen, onClose, title = "Спасибо!", message = "Мы свяжемся с вами в ближайшее время.", eventType }: ThankYouModalProps) {
  // Отправляем событие в Яндекс.Метрику при открытии модального окна
  if (isOpen && eventType) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.ym) {
      // @ts-ignore
      window.ym(22691407, 'reachGoal', eventType);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X size={24} weight="bold" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gold-200 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="https://www.w3.org/2000/svg" className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-neutral-900">{title}</h3>
              <p className="text-neutral-600">{message}</p>
              
              <button
                onClick={onClose}
                className="mt-4 bg-gold-200 text-black py-3 px-6 rounded-lg font-semibold hover:bg-gold-300 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 