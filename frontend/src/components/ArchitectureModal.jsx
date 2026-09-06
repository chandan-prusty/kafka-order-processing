import React from 'react';
import { X, Send, Database, GitBranch, Layers, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-orange-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Kafka System Architecture & Viva Guide</h3>
              <p className="text-xs text-orange-100">How real-time asynchronous event streaming works in this project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 custom-scrollbar text-sm">
          {/* Architecture Flow Diagram */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3">
              Event Flow (Publish - Subscribe)
            </h4>
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                {/* 1. Client / React */}
                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-sm">
                  <div className="text-xs font-bold text-slate-900">1. Client / React UI</div>
                  <p className="text-[11px] text-slate-500 mt-1">POST /api/orders</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700">
                    HTTP Request
                  </span>
                </div>

                {/* 2. Producer */}
                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-sm">
                  <div className="text-xs font-bold text-slate-900">2. Kafka Producer</div>
                  <p className="text-[11px] text-slate-500 mt-1">OrderProducer.java</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">
                    KafkaTemplate.send()
                  </span>
                </div>

                {/* 3. Kafka Broker */}
                <div className="p-3 bg-white rounded-xl border border-orange-200 shadow-sm ring-2 ring-orange-400/20">
                  <div className="text-xs font-bold text-orange-700">3. Topic: 'orders'</div>
                  <p className="text-[11px] text-slate-500 mt-1">Partition 0 (Port 9092)</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500 text-white">
                    Event Log Buffer
                  </span>
                </div>

                {/* 4. Consumers */}
                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-sm space-y-2">
                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 p-1 rounded border border-blue-100">
                    📦 inventory-group
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-1 rounded border border-emerald-100">
                    🔔 notification-group
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Viva Questions & Explanations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Viva Defense Highlights
            </h4>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>Why are there 2 Consumer Groups?</span>
              </h5>
              <p className="text-xs text-slate-600 mt-1 pl-5 leading-relaxed">
                Kafka uses <strong>Consumer Groups</strong> for the Publish-Subscribe pattern. Because <code>InventoryConsumer</code> belongs to <code>inventory-group</code> and <code>NotificationConsumer</code> belongs to <code>notification-group</code>, both receive the <strong>exact same message independently</strong>. If they had the same group ID, Kafka would load-balance and deliver the message to only one of them!
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>Why Kafka instead of synchronous REST API calls?</span>
              </h5>
              <p className="text-xs text-slate-600 mt-1 pl-5 leading-relaxed">
                <strong>Decoupling & Asynchrony:</strong> The customer gets an instant response after the order is published to Kafka. If the notification service is slow or down, the order placement is not blocked, and Kafka guarantees the notification consumer will process the event once it resumes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>How is In-Memory Storage implemented without a DB?</span>
              </h5>
              <p className="text-xs text-slate-600 mt-1 pl-5 leading-relaxed">
                We use Java's <code>ConcurrentHashMap</code> for thread-safe inventory stock counts and <code>CopyOnWriteArrayList</code> for order history and event stream logs, satisfying zero-database mini-project constraints.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>How does WhatsApp Click-to-Chat Notification work with Kafka?</span>
              </h5>
              <p className="text-xs text-slate-600 mt-1 pl-5 leading-relaxed">
                When an order event is consumed by <code>NotificationConsumer</code>, it parses the customer's phone number and asynchronously constructs a universal <code>https://wa.me/&lt;phone&gt;?text=&lt;encoded_msg&gt;</code> Click-to-Chat link. This allows sending immediate WhatsApp notifications with zero third-party APIs, zero cost, and zero authentication keys!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
