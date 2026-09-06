import React from 'react';
import { Layers, RotateCcw, Info, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ backendConnected, onReset, onOpenArchitecture }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">OrderStream</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                  Apache Kafka
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Real-Time Event-Driven Order Processing System</p>
            </div>
          </div>

          {/* Status Badges & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Backend Connectivity Badge */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              backendConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {backendConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Backend Live (8085)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Connecting...</span>
                </>
              )}
            </div>

            {/* Architecture Modal Button */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-lg transition-colors"
              title="View Kafka Architecture & Viva Guide"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kafka Architecture</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={onReset}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors shadow-sm"
              title="Reset inventory and orders back to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
