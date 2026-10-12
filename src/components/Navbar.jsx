import React from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  RotateCcw, 
  Sparkles,
  Layers
} from 'lucide-react';
import { PRESETS } from '../constants/presets';

export default function Navbar({ onSelectPreset, onReset, onOpenExplainer }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Exam Seating Arrangement
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Backtracking Solver
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              8-Neighbor Anti-Cheating Constraint • DAA Project
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Selector Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 shadow-xs"
              title="Load sample presets"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">Load Preset</span>
              <span className="md:hidden">Presets</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sample Test Scenarios
              </div>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex flex-col transition"
                >
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    {p.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate mt-0.5">
                    {p.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Algorithm Info Button */}
          <button
            onClick={onOpenExplainer}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
            title="Adjacency Rule Details"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">How it Works</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Reset Everything"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
