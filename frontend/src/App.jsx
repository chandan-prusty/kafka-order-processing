import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import OrderForm from './components/OrderForm';
import InventoryOverview from './components/InventoryOverview';
import LiveEventFeed from './components/LiveEventFeed';
import OrderHistory from './components/OrderHistory';
import Toast from './components/Toast';
import ArchitectureModal from './components/ArchitectureModal';
import { ShoppingCart, LayoutDashboard, SplitSquareVertical } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const DEFAULT_INVENTORY = {
  'Office Chair': 50,
  'Sofa': 20,
  'Table': 30,
  'Study Chair': 40
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [events, setEvents] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'order', 'dashboard'

  // Fetch current state from Spring Boot backend
  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, invRes, eventsRes, statusRes] = await Promise.all([
        fetch(`${API_BASE}/orders`).catch(() => null),
        fetch(`${API_BASE}/inventory`).catch(() => null),
        fetch(`${API_BASE}/events`).catch(() => null),
        fetch(`${API_BASE}/status`).catch(() => null),
      ]);

      if (statusRes && statusRes.ok) {
        setBackendConnected(true);
      } else {
        setBackendConnected(false);
      }

      if (ordersRes && ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (invRes && invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData);
      }

      if (eventsRes && eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.warn('Backend currently offline, using fallback state:', error);
      setBackendConnected(false);
    }
  }, []);

  // Poll backend every 1.5 seconds for live real-time updates
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle placing order (Kafka Producer trigger)
  const handlePlaceOrder = async (orderPayload) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to place order');
      }

      const result = await res.json();
      const placedOrder = result.order;

      // Show toast
      setToast({
        message: `Order published to Kafka topic 'orders' & consumed by both inventory-group and notification-group.`,
        order: placedOrder
      });

      // Auto hide toast after 5s
      setTimeout(() => setToast(null), 5000);

      // Refresh state immediately
      await fetchData();
    } catch (err) {
      alert(`Error submitting order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset demo state
  const handleReset = async () => {
    if (!window.confirm('Reset inventory and orders back to default viva state?')) return;
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f5]">
      {/* Top Navbar */}
      <Navbar
        backendConnected={backendConnected}
        onReset={handleReset}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Switcher Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-orange-100/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Order Processing System
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Event-driven architecture with Apache Kafka, Spring Boot, & independent consumers
            </p>
          </div>

          {/* View Tabs */}
          <div className="inline-flex p-1 bg-white border border-orange-100 rounded-xl shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Live Console (All)</span>
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'order'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Customer Order Page</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard & Feed</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <StatsCards orders={orders} inventory={inventory} />

        {/* Tab 1: All in One (Split Layout) */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Order Page & Inventory Status */}
            <div className="lg:col-span-5 space-y-6">
              <OrderForm
                inventory={inventory}
                onSubmitOrder={handlePlaceOrder}
                isSubmitting={isSubmitting}
              />
              <InventoryOverview inventory={inventory} />
            </div>

            {/* Right Column: Live Event Feed & Order History */}
            <div className="lg:col-span-7 space-y-6">
              <LiveEventFeed
                events={events}
                onRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
              />
              <OrderHistory orders={orders} />
            </div>
          </div>
        )}

        {/* Tab 2: Customer Order Page Dedicated View */}
        {activeTab === 'order' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <OrderForm
              inventory={inventory}
              onSubmitOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
            <InventoryOverview inventory={inventory} />
          </div>
        )}

        {/* Tab 3: Dedicated Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-6">
                <InventoryOverview inventory={inventory} />
                <OrderHistory orders={orders} />
              </div>
              <div className="lg:col-span-6">
                <LiveEventFeed
                  events={events}
                  onRefresh={handleManualRefresh}
                  isRefreshing={isRefreshing}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Toast Notification */}
      <Toast
        message={toast?.message}
        order={toast?.order}
        onClose={() => setToast(null)}
      />

      {/* Architecture & Viva Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-orange-100 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <p>Real-Time Order Processing System • Apache Kafka Mini Project for College Viva</p>
      </footer>
    </div>
  );
}
