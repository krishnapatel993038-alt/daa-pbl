import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import InputPanel from './components/InputPanel';
import VisualizationBoard from './components/VisualizationBoard';
import FeedbackCard from './components/FeedbackCard';
import AdjacencyExplainerModal from './components/AdjacencyExplainerModal';
import { PRESETS } from './constants/presets';
import { 
  solveSeatingArrangement, 
  createBacktrackingGenerator 
} from './algorithms/backtracking';
import { 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Cpu, 
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const initialPreset = PRESETS[0];

  const [rows, setRows] = useState(initialPreset.rows);
  const [cols, setCols] = useState(initialPreset.cols);
  const [subjects, setSubjects] = useState(initialPreset.subjects);
  
  const [grid, setGrid] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Solving options
  const [solveMode, setSolveMode] = useState('instant');
  const [animationSpeed, setAnimationSpeed] = useState(40);
  const [isSolving, setIsSolving] = useState(false);
  const [activeCell, setActiveCell] = useState(null);

  // Modal
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  // Animation cancellation ref
  const animationRef = useRef(null);

  // Initial solve on mount so user sees a beautiful grid right away
  useEffect(() => {
    handleSolveInstant(initialPreset.rows, initialPreset.cols, initialPreset.subjects);
  }, []);

  const handleSelectPreset = (preset) => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsSolving(false);
    setActiveCell(null);
    setRows(preset.rows);
    setCols(preset.cols);
    setSubjects(preset.subjects);
    handleSolveInstant(preset.rows, preset.cols, preset.subjects);
  };

  const handleReset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsSolving(false);
    setActiveCell(null);
    setRows(4);
    setCols(5);
    setSubjects([
      { id: 'sub-1', name: 'Mathematics', count: 5, color: 'blue' },
      { id: 'sub-2', name: 'Physics', count: 4, color: 'emerald' },
      { id: 'sub-3', name: 'Chemistry', count: 3, color: 'amber' },
    ]);
    setGrid(null);
    setStats(null);
    setError(null);
    setSuccess(false);
  };

  const handleSolveInstant = (r = rows, c = cols, subjs = subjects) => {
    setIsSolving(true);
    setActiveCell(null);
    setError(null);
    setSuccess(false);

    // Yield to allow UI render
    setTimeout(() => {
      const result = solveSeatingArrangement(r, c, subjs);
      setIsSolving(false);

      if (result.success) {
        setGrid(result.grid);
        setStats(result.stats);
        setError(null);
        setSuccess(true);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            disableForReducedMotion: true,
          });
        } catch (_) {}
      } else {
        setGrid(Array.from({ length: r }, () => Array(c).fill(null)));
        setStats(result.stats);
        setError(result.error);
        setSuccess(false);
      }
    }, 20);
  };

  const handleSolveAnimated = () => {
    setIsSolving(true);
    setError(null);
    setSuccess(false);
    setActiveCell(null);

    // Initial empty grid
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(null)));

    const generator = createBacktrackingGenerator(rows, cols, subjects, 1500);

    const stepRunner = () => {
      const next = generator.next();

      if (next.done) {
        setIsSolving(false);
        setActiveCell(null);
        return;
      }

      const val = next.value;

      if (val.type === 'error' || val.type === 'failed') {
        setIsSolving(false);
        setActiveCell(null);
        setError(val.message);
        setSuccess(false);
        return;
      }

      if (val.type === 'done') {
        setIsSolving(false);
        setActiveCell(null);
        setGrid(val.grid);
        setSuccess(true);
        const totalDesks = rows * cols;
        const totalStudents = subjects.reduce((s, x) => s + (parseInt(x.count, 10) || 0), 0);
        setStats({
          steps: val.stepCount,
          backtracks: val.backtrackCount,
          durationMs: 'Visual Run',
          totalDesks,
          totalStudents,
          emptyDesks: totalDesks - totalStudents,
        });
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.8 },
          });
        } catch (_) {}
        return;
      }

      // Intermediate step
      if (val.grid) {
        setGrid(val.grid);
      }
      setActiveCell({ r: val.r, c: val.c, type: val.type });

      animationRef.current = setTimeout(stepRunner, animationSpeed);
    };

    animationRef.current = setTimeout(stepRunner, animationSpeed);
  };

  const handleStopAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsSolving(false);
    setActiveCell(null);
  };

  const handleGenerate = () => {
    if (solveMode === 'animated') {
      handleSolveAnimated();
    } else {
      handleSolveInstant(rows, cols, subjects);
    }
  };

  const handleAutoExpand = () => {
    const nextR = Math.min(10, rows + 1);
    const nextC = Math.min(10, cols + 1);
    setRows(nextR);
    setCols(nextC);
    handleSolveInstant(nextR, nextC, subjects);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navigation */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenExplainer={() => setIsExplainerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
              <span>Constraint Satisfaction with Backtracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white m-0">
              Exam Seating Arrangement Solver
            </h1>
            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
              Guarantees zero exam cheating by ensuring no two students taking the same subject sit in adjacent desks horizontally, vertically, or diagonally. Powered by recursive backtracking with 8-neighbor adjacency validation.
            </p>
          </div>

          {/* Decorative background grid rings */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-12 top-6 opacity-10 hidden md:block">
            <Cpu className="w-48 h-48" />
          </div>
        </div>

        {/* Feedback / Error / Telemetry Banner */}
        <FeedbackCard
          error={error}
          success={success}
          stats={stats}
          rows={rows}
          cols={cols}
          onAutoExpand={handleAutoExpand}
          onOpenExplainer={() => setIsExplainerOpen(true)}
          onPrint={handlePrint}
        />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input and Configuration Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <InputPanel
              rows={rows}
              setRows={setRows}
              cols={cols}
              setCols={setCols}
              subjects={subjects}
              setSubjects={setSubjects}
              onGenerate={handleGenerate}
              isSolving={isSolving}
              solveMode={solveMode}
              setSolveMode={setSolveMode}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
              onStopAnimation={handleStopAnimation}
            />

            {/* Quick Algorithm Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Algorithm Specifications (DAA)
              </h3>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>Recursive Backtracking:</strong> Visits each desk index from <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">0</code> to <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">R×C - 1</code>.
                </p>
                <p>
                  <strong>Safety Check (isSafe):</strong> Verifies all 8 directions <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">N, S, E, W, NE, NW, SE, SW</code>.
                </p>
                <p>
                  <strong>Degree Pruning:</strong> Sorts subjects by remaining count descending to prune unviable state-space branches early.
                </p>
              </div>
              <button
                onClick={() => setIsExplainerOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
              >
                <span>Read detailed pseudocode & King&apos;s graph theorem</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Seating Visualization Board (7 cols) */}
          <div className="lg:col-span-7">
            <VisualizationBoard
              grid={grid}
              rows={rows}
              cols={cols}
              subjects={subjects}
              activeCell={activeCell}
              stats={stats || { totalDesks: rows * cols, emptyDesks: rows * cols }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© Exam Seating Arrangement Solver • DAA PBL Project • Client-Side Backtracking</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExplainerOpen(true)}
              className="hover:text-blue-600 transition"
            >
              Adjacency Constraints
            </button>
            <span>•</span>
            <button
              onClick={handlePrint}
              className="hover:text-blue-600 transition"
            >
              Print Seating Plan
            </button>
          </div>
        </div>
      </footer>

      {/* Explainer Modal */}
      <AdjacencyExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </div>
  );
}
