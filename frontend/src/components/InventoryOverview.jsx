import React from 'react';
import { PackageCheck, AlertCircle } from 'lucide-react';

const PRODUCT_METAS = {
  'Office Chair': { icon: '🪑', initial: 50, tag: 'Ergonomic' },
  'Sofa': { icon: '🛋️', initial: 20, tag: '3-Seater Comfort' },
  'Table': { icon: '🪵', initial: 30, tag: 'Solid Oak' },
  'Study Chair': { icon: '🪑', initial: 40, tag: 'Adjustable' }
};

export default function InventoryOverview({ inventory }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900">Inventory Status</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              inventory-group
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">In-Memory ConcurrentHashMap automatically updated by Kafka Consumer</p>
        </div>
        <PackageCheck className="w-6 h-6 text-orange-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(PRODUCT_METAS).map(([name, meta]) => {
          const current = inventory[name] ?? meta.initial;
          const percentage = Math.min(100, Math.round((current / meta.initial) * 100));

          let barColor = 'bg-emerald-500';
          let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (percentage < 25) {
            barColor = 'bg-rose-500';
            badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (percentage < 50) {
            barColor = 'bg-amber-500';
            badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          return (
            <div
              key={name}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                    <span className="text-xs text-slate-400">{meta.tag}</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                  {current} / {meta.initial}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Stock capacity</span>
                  <span>{percentage}% remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
