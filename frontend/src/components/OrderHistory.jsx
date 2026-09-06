import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function OrderHistory({ orders }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Orders Processed</h3>
          <p className="text-xs text-slate-500 mt-0.5">In-Memory ArrayList history</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
          {orders.length} Total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
          <p className="text-sm">No orders recorded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-center">WhatsApp</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-orange-50/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.orderId}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{ord.customerName}</td>
                  <td className="py-3 px-3 text-slate-600">{ord.product}</td>
                  <td className="py-3 px-3 text-center font-bold text-orange-600">{ord.quantity}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{ord.timestamp}</td>
                  <td className="py-3 px-3 text-center">
                    {ord.whatsappUrl ? (
                      <a
                        href={ord.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                        title="Open WhatsApp Chat"
                      >
                        <span>💬 Chat</span>
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{ord.status || 'PROCESSED'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
