import React from 'react';
import { ShoppingBag, Box, Clock, GitBranch } from 'lucide-react';

export default function StatsCards({ orders, inventory }) {
  const totalOrders = orders.length;
  const totalStock = Object.values(inventory).reduce((acc, curr) => acc + curr, 0);
  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Orders */}
      <div className="bg-white rounded-2xl p-5 border border-orange-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalOrders}</h3>
            <p className="text-xs text-slate-500 mt-1">Processed via Kafka</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 2: Inventory Remaining */}
      <div className="bg-white rounded-2xl p-5 border border-orange-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Inventory Remaining</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalStock} <span className="text-sm font-normal text-slate-500">units</span></h3>
            <p className="text-xs text-slate-500 mt-1">Across 4 furniture items</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Box className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 3: Latest Order */}
      <div className="bg-white rounded-2xl p-5 border border-orange-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Latest Order</p>
            {latestOrder ? (
              <>
                <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">{latestOrder.orderId}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{latestOrder.customerName} • {latestOrder.product} (x{latestOrder.quantity})</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-400 mt-1">No Orders Yet</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submit the form below</p>
              </>
            )}
          </div>
          <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 4: Kafka Architecture Status */}
      <div className="bg-white rounded-2xl p-5 border border-orange-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Topic: "orders"</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">2 Consumers</h3>
            <p className="text-xs text-slate-500 mt-0.5">Inventory & Notification groups</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <GitBranch className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
