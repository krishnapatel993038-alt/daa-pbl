import React from 'react';
import { X, ShieldAlert, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdjacencyExplainerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                Algorithm & Anti-Cheating Logic
              </h2>
              <p className="text-xs text-slate-500">
                Design and Analysis of Algorithms (DAA) Backtracking Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 text-sm">
          {/* Adjacency Rule */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              The 8-Neighbor Anti-Cheating Constraint
            </h3>
            <p className="text-amber-800/90 text-xs leading-relaxed">
              To prevent peer communication and visual cheating during exams, no two students taking the <strong>same subject</strong> may be placed in adjacent desks across any of the <strong>8 directions</strong>:
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5 max-w-xs mx-auto text-center font-mono text-xs">
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">NW (-1,-1)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">North (-1,0)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">NE (-1,+1)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">West (0,-1)</div>
              <div className="p-2 bg-blue-600 text-white rounded font-bold shadow-sm">Target Cell</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">East (0,+1)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">SW (+1,-1)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">South (+1,0)</div>
              <div className="p-2 bg-white rounded border border-amber-300 text-amber-700">SE (+1,+1)</div>
            </div>
          </div>

          {/* Backtracking Steps */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900">How the Backtracking Solver Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-semibold text-blue-600 mb-1">1. Choose & Inspect</div>
                <p className="text-slate-600 leading-relaxed">
                  Visits cell <code className="bg-slate-200/80 px-1 py-0.5 rounded">(r, c)</code>. Checks <code className="text-blue-700 font-semibold">isSafe()</code> across all 8 surrounding neighbors for the candidate subject.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-semibold text-emerald-600 mb-1">2. Recurse</div>
                <p className="text-slate-600 leading-relaxed">
                  If safe, temporarily places student, decrements subject quota, and recursively explores the next desk <code className="bg-slate-200/80 px-1 py-0.5 rounded">(cellIndex + 1)</code>.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-semibold text-rose-600 mb-1">3. Backtrack</div>
                <p className="text-slate-600 leading-relaxed">
                  If downstream assignments reach a dead end, reverts the cell back to empty, restores the subject quota, and tries the next candidate.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Feasibility Alert */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              King&apos;s Graph Independent Set Limit:
            </div>
            <p className="text-slate-600">
              In graph theory, this is isomorphic to the independent set problem on an $R \times C$ King&apos;s Graph. The maximum capacity for any single subject is strictly bounded by <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">⌈Rows / 2⌉ × ⌈Cols / 2⌉</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-sm"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
}
