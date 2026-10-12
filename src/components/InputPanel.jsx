import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Grid3X3, 
  Users, 
  Play, 
  AlertCircle, 
  Check, 
  Zap, 
  Film,
  Shuffle
} from 'lucide-react';
import { SUBJECT_PALETTES, getPaletteForIndex, getPaletteById } from '../constants/colors';

export default function InputPanel({
  rows,
  setRows,
  cols,
  setCols,
  subjects,
  setSubjects,
  onGenerate,
  isSolving,
  solveMode,
  setSolveMode,
  animationSpeed,
  setAnimationSpeed,
  onStopAnimation,
}) {
  const [newSubName, setNewSubName] = useState('');
  const [newSubCount, setNewSubCount] = useState(4);
  const [selectedColor, setSelectedColor] = useState(
    getPaletteForIndex(subjects.length).id
  );
  const [inputError, setInputError] = useState('');

  const totalDesks = rows * cols;
  const totalStudents = subjects.reduce((sum, s) => sum + (parseInt(s.count, 10) || 0), 0);
  const capacityUsed = Math.min(100, Math.round((totalStudents / (totalDesks || 1)) * 100));
  const isOverCapacity = totalStudents > totalDesks;

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubName.trim();
    if (!trimmed) {
      setInputError('Please enter a subject name');
      return;
    }

    const countNum = parseInt(newSubCount, 10);
    if (isNaN(countNum) || countNum <= 0) {
      setInputError('Student count must be at least 1');
      return;
    }

    // Add subject
    const newSubject = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: trimmed,
      count: countNum,
      color: selectedColor,
    };

    setSubjects([...subjects, newSubject]);
    setNewSubName('');
    setNewSubCount(4);
    // Cycle to next color palette
    setSelectedColor(getPaletteForIndex(subjects.length + 1).id);
    setInputError('');
  };

  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdateSubjectCount = (id, newCount) => {
    const val = Math.max(1, parseInt(newCount, 10) || 1);
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, count: val } : s))
    );
  };

  const handleUpdateSubjectName = (id, newName) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const handleUpdateSubjectColor = (id, newColor) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, color: newColor } : s))
    );
  };

  const handleQuickAdd = () => {
    const sampleNames = ['Data Structures', 'Algorithms', 'Linear Algebra', 'Physics', 'Discrete Math', 'Operating Systems'];
    const unused = sampleNames.filter(n => !subjects.some(s => s.name.toLowerCase() === n.toLowerCase()));
    const nextName = unused.length > 0 ? unused[0] : `Subject ${subjects.length + 1}`;
    
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: nextName,
      count: 4,
      color: getPaletteForIndex(subjects.length).id,
    };
    setSubjects([...subjects, newSubject]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Grid3X3 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Classroom & Subject Setup
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Capacity: <strong className="text-slate-800">{totalStudents}</strong> / {totalDesks} desks
        </span>
      </div>

      {/* Grid Dimensions */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Grid3X3 className="w-3.5 h-3.5 text-slate-500" />
          Grid Dimensions (Rows × Cols)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Rows input */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">Rows (R)</span>
              <span className="text-xs font-bold text-blue-600 font-mono">{rows}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRows(Math.max(2, rows - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                aria-label="Decrease rows"
              >
                -
              </button>
              <input
                id="input-grid-rows"
                type="number"
                min="2"
                max="10"
                value={rows}
                onChange={(e) => setRows(Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2)))}
                className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-semibold text-slate-800 text-sm focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setRows(Math.min(10, rows + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                aria-label="Increase rows"
              >
                +
              </button>
            </div>
          </div>

          {/* Columns input */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">Columns (C)</span>
              <span className="text-xs font-bold text-blue-600 font-mono">{cols}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCols(Math.max(2, cols - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                aria-label="Decrease columns"
              >
                -
              </button>
              <input
                id="input-grid-cols"
                type="number"
                min="2"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2)))}
                className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-semibold text-slate-800 text-sm focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setCols(Math.min(10, cols + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                aria-label="Increase columns"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Grid Capacity Meter</span>
            <span className={isOverCapacity ? 'font-bold text-rose-600' : 'font-semibold text-slate-700'}>
              {capacityUsed}% filled ({totalStudents}/{totalDesks})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverCapacity 
                  ? 'bg-rose-500' 
                  : capacityUsed > 85 
                    ? 'bg-amber-500' 
                    : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, (totalStudents / totalDesks) * 100)}%` }}
            />
          </div>
          {isOverCapacity && (
            <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Total students exceed room desk capacity by {totalStudents - totalDesks}.
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Subjects List */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Enrolled Subjects ({subjects.length})
          </label>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            + Quick Add
          </button>
        </div>

        {/* List of current subjects */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {subjects.length === 0 ? (
            <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              No subjects added yet. Add a subject below!
            </div>
          ) : (
            subjects.map((sub, idx) => {
              const pal = getPaletteById(sub.color);
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:shadow-xs transition"
                >
                  {/* Color Selector circle */}
                  <div className="relative group shrink-0">
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-lg ${pal.avatar} flex items-center justify-center font-bold text-xs shadow-xs`}
                      title="Change color"
                    >
                      {sub.name.charAt(0).toUpperCase() || (idx + 1)}
                    </button>
                    {/* Color picker dropdown on hover */}
                    <div className="absolute left-0 mt-1 p-2 bg-white rounded-xl shadow-lg border border-slate-200 hidden group-hover:grid grid-cols-5 gap-1.5 z-30 w-44">
                      {SUBJECT_PALETTES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleUpdateSubjectColor(sub.id, p.id)}
                          className="w-6 h-6 rounded-md transition hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: p.hex }}
                          title={p.label}
                        >
                          {sub.color === p.id && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Name Input */}
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => handleUpdateSubjectName(sub.id, e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white px-1.5 py-0.5 rounded text-xs font-semibold text-slate-800 focus:outline-hidden"
                    placeholder="Subject name"
                  />

                  {/* Student Count Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-slate-400 mr-1">Students:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={sub.count}
                      onChange={(e) => handleUpdateSubjectCount(sub.id, e.target.value)}
                      className="w-14 text-center bg-white border border-slate-200 rounded-lg py-1 px-1 font-bold text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Delete Subject Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(sub.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                    title="Remove subject"
                    aria-label={`Remove subject ${sub.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic Add Subject Form */}
        <form onSubmit={handleAddSubject} className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Add New Subject</span>
            <div className="flex items-center gap-1">
              {SUBJECT_PALETTES.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedColor(p.id)}
                  className={`w-4 h-4 rounded-full transition ${selectedColor === p.id ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: p.hex }}
                  title={p.label}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-7">
              <input
                id="input-subject-name"
                type="text"
                value={newSubName}
                onChange={(e) => {
                  setNewSubName(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="e.g. Mathematics, Chemistry"
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-5 flex items-center gap-2">
              <input
                id="input-student-count"
                type="number"
                min="1"
                max="50"
                value={newSubCount}
                onChange={(e) => setNewSubCount(e.target.value)}
                placeholder="Count"
                className="w-full text-xs px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-center font-semibold focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                id="btn-add-subject"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {inputError && (
            <p className="text-[11px] text-rose-600 font-medium">{inputError}</p>
          )}
        </form>
      </div>

      {/* Solver Mode and Speed Control */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Solve Execution Mode</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setSolveMode('instant')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                solveMode === 'instant' 
                  ? 'bg-white text-blue-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Instant</span>
            </button>
            <button
              type="button"
              onClick={() => setSolveMode('animated')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                solveMode === 'animated' 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Animated</span>
            </button>
          </div>
        </div>

        {solveMode === 'animated' && (
          <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <span className="text-indigo-900 font-medium text-[11px]">Animation Speed:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'Slow', val: 120 },
                { label: 'Normal', val: 40 },
                { label: 'Fast', val: 5 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setAnimationSpeed(s.val)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
                    animationSpeed === s.val
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        {isSolving && solveMode === 'animated' ? (
          <button
            type="button"
            onClick={onStopAnimation}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Stop Visual Backtracking</span>
          </button>
        ) : (
          <button
            id="btn-generate-plan"
            type="button"
            onClick={onGenerate}
            disabled={isSolving || subjects.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 ${
              isSolving || subjects.length === 0
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Generate Seating Plan</span>
          </button>
        )}
      </div>
    </div>
  );
}
