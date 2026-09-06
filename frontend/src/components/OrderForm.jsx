import React, { useState } from 'react';
import { Send, Armchair, AlertTriangle, Check, Sparkles } from 'lucide-react';

const PRODUCTS = [
  { name: 'Office Chair', price: '$180', icon: '🪑' },
  { name: 'Sofa', price: '$650', icon: '🛋️' },
  { name: 'Table', price: '$320', icon: '🪵' },
  { name: 'Study Chair', price: '$140', icon: '🪑' }
];

export default function OrderForm({ inventory, onSubmitOrder, isSubmitting }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [product, setProduct] = useState('Office Chair');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');

  const currentStock = inventory[product] ?? 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName.trim()) {
      setValidationError('Please enter customer name');
      return;
    }

    if (quantity <= 0) {
      setValidationError('Quantity must be at least 1');
      return;
    }

    if (quantity > currentStock) {
      setValidationError(`Only ${currentStock} units of ${product} available in stock!`);
      return;
    }

    onSubmitOrder({
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      product,
      quantity: Number(quantity)
    });

    // Reset customer name, keep product
    setCustomerName('');
    setQuantity(1);
  };

  const selectedProductInfo = PRODUCTS.find(p => p.name === product) || PRODUCTS[0];

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sm:p-7 relative overflow-hidden">
      {/* Header Accent Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-900">Place Customer Order</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
              Kafka Producer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitting triggers a message to topic <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-orange-600">orders</code>
          </p>
        </div>
        <div className="text-2xl">{selectedProductInfo.icon}</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Customer Name <span className="text-orange-600">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            required
            placeholder="e.g. Sarah Jenkins"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm transition-all bg-slate-50/50 focus:bg-white"
          />
        </div>

        {/* WhatsApp Phone Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              WhatsApp Phone Number
            </label>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              💬 Click-to-Chat
            </span>
          </div>
          <input
            id="phoneNumber"
            type="text"
            placeholder="+91 9876543210 (Country code + number)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all bg-slate-50/50 focus:bg-white font-mono"
          />
        </div>

        {/* Product Dropdown */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="productSelect" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Product <span className="text-orange-600">*</span>
            </label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              currentStock > 10
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : currentStock > 0
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
            </span>
          </div>
          <select
            id="productSelect"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm transition-all bg-slate-50/50 focus:bg-white cursor-pointer"
          >
            {PRODUCTS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.icon} {item.name} — {inventory[item.name] ?? 0} available
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantityInput" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Quantity <span className="text-orange-600">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              -
            </button>
            <input
              id="quantityInput"
              type="number"
              min="1"
              max={Math.max(1, currentStock)}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-semibold transition-all"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              disabled={quantity >= currentStock}
              className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="flex items-center space-x-2 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Order Button */}
        <button
          type="submit"
          disabled={isSubmitting || currentStock === 0}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Publishing to Kafka...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Place Order (Send Kafka Event)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
