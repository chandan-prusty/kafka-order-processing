import React from 'react';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

export default function Toast({ message, order, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-fade-in">
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-4 border border-slate-700/60 flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
            <span>Kafka Message Dispatched!</span>
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">{message}</p>
          {order && (
            <div className="mt-2 pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-orange-400 font-bold">{order.orderId}</span>
                <span className="text-slate-400">{order.customerName} • {order.product} (x{order.quantity})</span>
              </div>
              {order.whatsappUrl && (
                <a
                  href={order.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition text-xs shadow-sm shadow-emerald-900/30"
                >
                  <span>💬 Open WhatsApp Notification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
