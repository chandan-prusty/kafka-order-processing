import React, { useState } from 'react';
import { Activity, Send, Package, Bell, RefreshCw, Filter } from 'lucide-react';

export default function LiveEventFeed({ events, onRefresh, isRefreshing }) {
  const [filter, setFilter] = useState('ALL');

  const filteredEvents = events.filter(e => {
    if (filter === 'PRODUCER') return e.source === 'PRODUCER';
    if (filter === 'INVENTORY') return e.source === 'INVENTORY_CONSUMER';
    if (filter === 'NOTIFICATION') return e.source === 'NOTIFICATION_CONSUMER';
    return true;
  });

  const getSourceBadge = (source) => {
    switch (source) {
      case 'PRODUCER':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <Send className="w-3 h-3 mr-1" /> Producer
          </span>
        );
      case 'INVENTORY_CONSUMER':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Package className="w-3 h-3 mr-1" /> Inventory Consumer
          </span>
        );
      case 'NOTIFICATION_CONSUMER':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Bell className="w-3 h-3 mr-1" /> Notification Consumer
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">Live Kafka Event Feed</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {events.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">Real-time stream from topic 'orders'</p>
          </div>
        </div>

        {/* Filter Pills & Refresh */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PRODUCER')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'PRODUCER' ? 'bg-white text-orange-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Producer
            </button>
            <button
              onClick={() => setFilter('INVENTORY')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'INVENTORY' ? 'bg-white text-blue-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setFilter('NOTIFICATION')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'NOTIFICATION' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Notification
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-slate-200 transition disabled:opacity-50"
            title="Refresh event stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Activity className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No events in stream yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Submit an order to watch Kafka Producer & Consumers trigger live events</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-orange-200 transition shadow-xs animate-fade-in"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  {getSourceBadge(evt.source)}
                  <span className="text-xs font-mono font-bold text-slate-700">{evt.orderId}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
              </div>
              <p className="text-xs font-medium text-slate-800 pl-0.5 leading-relaxed">{evt.message}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100/80">
                <span>Group: <code className="text-slate-600 font-mono">{evt.consumerGroup}</code></span>
                {evt.remainingStock >= 0 && (
                  <span className="font-medium text-slate-600">
                    Remaining Stock: <strong className="text-orange-600">{evt.remainingStock}</strong>
                  </span>
                )}
              </div>
              {evt.whatsappUrl && (
                <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-medium">WhatsApp Notification Ready</span>
                  <a
                    href={evt.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                  >
                    <span>💬 Open WhatsApp Chat</span>
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
