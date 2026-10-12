import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  GitBranch, 
  Hash, 
  Printer, 
  Download,
  Info
} from 'lucide-react';

export default function FeedbackCard({
  error,
  success,
  stats,
  rows,
  cols,
  onAutoExpand,
  onOpenExplainer,
  onPrint,
}) {
  if (!error && !success) {
    return (
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            Ready to compute. Configure the classroom grid and subject counts on the left, then click <strong>Generate Seating Plan</strong>.
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        id="error-feedback-container"
        className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-900 shadow-sm animate-in fade-in space-y-4"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              Seating Arrangement Impossible
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              {error}
            </p>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-2">
          <div className="font-semibold text-rose-950 flex items-center justify-between">
            <span>Why did the backtracking algorithm fail?</span>
            <button
              onClick={onOpenExplainer}
              className="text-blue-600 hover:underline flex items-center gap-1 font-normal text-[11px]"
            >
              <HelpCircle className="w-3 h-3" />
              View Mathematical Proof
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-800/90 text-[11px]">
            <li>
              <strong>8-Neighbor Constraint:</strong> No two students of the same subject can share an edge or corner desk.
            </li>
            <li>
              <strong>King&apos;s Graph Independence:</strong> In a {rows}×{cols} grid, the theoretical maximum capacity for any single subject is <strong>{Math.ceil(rows / 2) * Math.ceil(cols / 2)}</strong> desks.
            </li>
            <li>
              <strong>Pigeonhole Constraint:</strong> If one subject exceeds its independent set bound, every branch in the state-space tree terminates in conflict.
            </li>
          </ul>
        </div>

        {/* Remediation Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-rose-900">Suggested Action:</span>
          {onAutoExpand && (
            <button
              onClick={onAutoExpand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span>Auto-Expand Grid ({rows + 1}×{cols + 1})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-5 text-emerald-950 shadow-sm animate-in fade-in space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Valid Anti-Cheating Seating Plan Generated!
            </h3>
            <p className="text-xs text-emerald-800">
              Zero 8-neighbor conflicts found across all horizontal, vertical, and diagonal desks.
            </p>
          </div>
        </div>

        {/* Print / Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/60 text-emerald-800 border border-emerald-300 text-xs font-semibold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

      {/* Algorithm Performance Telemetry */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" /> Time Taken
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {stats.durationMs} <span className="text-[11px] font-normal text-slate-500">ms</span>
            </div>
          </div>

          <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Hash className="w-3 h-3 text-blue-600" /> Recursive Calls
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {stats.steps.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <GitBranch className="w-3 h-3 text-amber-600" /> Backtracks
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {stats.backtracks.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 text-center">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              Desks Utilized
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {stats.totalStudents} / {stats.totalDesks}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
