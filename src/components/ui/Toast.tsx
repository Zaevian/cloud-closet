import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/AppStoreContext';
import { toastVariants } from '../../motion';

export function ToastContainer() {
  const { state, dispatch } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {state.toasts.map(toast => (
          <motion.div
            key={toast.id}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pointer-events-auto"
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl max-w-sm glass border ${
              toast.type === 'success' ? 'border-teal-400/40' :
              toast.type === 'error' ? 'border-red-400/40' : 'border-white/20'
            }`}>
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
              <button
                onClick={() => dispatch({ type: 'DISMISS_TOAST', payload: toast.id })}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
