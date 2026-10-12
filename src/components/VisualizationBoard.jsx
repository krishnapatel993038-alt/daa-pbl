import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Presentation,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { getPaletteById } from '../constants/colors';
import { NEIGHBOR_DIRECTIONS } from '../algorithms/backtracking';

export default function VisualizationBoard({
  grid,
  rows,
  cols,
  subjects,
  activeCell, // for animation highlighting { r, c, type }
  stats,
}) {
  const [hoveredDesk, setHoveredDesk] = useState(null); // { r, c }

  // Compute neighbor set of hovered desk for the 8-adjacency highlighter
  const neighborKeys = new Set();
  if (hoveredDesk) {
    for (const [dr, dc] of NEIGHBOR_DIRECTIONS) {
      const nr = hoveredDesk.r + dr;
      const nc = hoveredDesk.c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighborKeys.add(`${nr}-${nc}`);
      }
    }
  }

  // Calculate subject counts on board
  const placedCounts = {};
  if (grid) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (cell) {
          placedCounts[cell.subjectId] = (placedCounts[cell.subjectId] || 0) + 1;
        }
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-5">
      {/* Room Stage Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Presentation className="w-4 h-4 text-blue-600" />
            Classroom Seating Grid
          </h2>
          <p className="text-xs text-slate-500">
            {rows} Rows × {cols} Columns ({rows * cols} Total Desks) • Hover over any desk to inspect 8-neighbor safety zone
          </p>
        </div>

        {/* Adjacency inspector legend hint */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-medium">8-Neighbor Inspector Active</span>
          </div>
        </div>
      </div>

      {/* Blackboard / Instructor Stage Banner */}
      <div className="w-full max-w-lg mx-auto bg-slate-800 text-white rounded-xl py-2 px-4 shadow-sm flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          FRONT OF EXAMINATION HALL
        </div>
        <span className="text-slate-400 font-mono text-[11px]">BLACKBOARD / INSTRUCTOR PODIUM</span>
      </div>

      {/* 2D Grid Layout Container */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="inline-block min-w-full align-middle">
          {/* Top Column Labels */}
          <div 
            className="grid gap-2.5 mb-2 text-center"
            style={{ 
              gridTemplateColumns: `36px repeat(${cols}, minmax(105px, 1fr))`,
            }}
          >
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center">#</div>
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Col {c + 1}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="space-y-2.5">
            {Array.from({ length: rows }, (_, r) => (
              <div
                key={r}
                className="grid gap-2.5 items-center"
                style={{
                  gridTemplateColumns: `36px repeat(${cols}, minmax(105px, 1fr))`,
                }}
              >
                {/* Row Header Label */}
                <div className="text-[11px] font-bold text-slate-500 font-mono text-center flex items-center justify-center">
                  R{r + 1}
                </div>

                {/* Desk Cells in Row r */}
                {Array.from({ length: cols }, (_, c) => {
                  const deskCell = grid ? grid[r][c] : null;
                  const isHovered = hoveredDesk && hoveredDesk.r === r && hoveredDesk.c === c;
                  const isNeighbor = neighborKeys.has(`${r}-${c}`);
                  const isAnimActive = activeCell && activeCell.r === r && activeCell.c === c;

                  // Animation status styling
                  let animBorder = '';
                  if (isAnimActive) {
                    if (activeCell.type === 'inspect-conflict') animBorder = 'ring-4 ring-rose-500 scale-105';
                    else if (activeCell.type === 'inspect-safe') animBorder = 'ring-4 ring-blue-500 scale-105';
                    else if (activeCell.type === 'placed') animBorder = 'ring-4 ring-emerald-500 scale-105';
                    else if (activeCell.type === 'backtrack') animBorder = 'ring-4 ring-amber-500';
                  }

                  // Determine neighbor conflict if hovered
                  let neighborWarning = false;
                  if (hoveredDesk && isNeighbor && deskCell && grid && grid[hoveredDesk.r][hoveredDesk.c]) {
                    const centerSubject = grid[hoveredDesk.r][hoveredDesk.c].subjectId;
                    if (deskCell.subjectId === centerSubject) {
                      neighborWarning = true;
                    }
                  }

                  if (!deskCell) {
                    // Empty Desk
                    return (
                      <div
                        key={c}
                        onMouseEnter={() => setHoveredDesk({ r, c })}
                        onMouseLeave={() => setHoveredDesk(null)}
                        className={`h-24 sm:h-28 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between p-2.5 select-none relative group ${
                          isHovered
                            ? 'bg-slate-200/90 border-slate-400 ring-2 ring-blue-400 shadow-md scale-[1.02]'
                            : isNeighbor
                              ? 'bg-slate-100 border-dashed border-blue-400/80 shadow-xs'
                              : 'bg-slate-100/70 border-slate-200/90 hover:border-slate-300'
                        } ${animBorder}`}
                      >
                        {/* Desk Coordinates Tag */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{String.fromCharCode(65 + r)}{c + 1}</span>
                          <span className="text-[9px] uppercase tracking-wider">Empty</span>
                        </div>

                        {/* Empty Desk Content */}
                        <div className="flex flex-col items-center justify-center my-auto">
                          <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 mb-1">
                            <span className="text-xs font-bold font-mono">∅</span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">Empty Desk</span>
                        </div>

                        {/* Bottom Status bar */}
                        <div className="h-1 rounded-full bg-slate-200/80" />
                      </div>
                    );
                  }

                  // Occupied Desk
                  const pal = getPaletteById(deskCell.color);

                  return (
                    <div
                      key={c}
                      onMouseEnter={() => setHoveredDesk({ r, c })}
                      onMouseLeave={() => setHoveredDesk(null)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between p-2.5 select-none relative shadow-xs animate-desk-pop ${pal.bg} ${pal.border} ${
                        isHovered
                          ? `ring-4 ring-blue-500 shadow-lg scale-[1.03] z-20 ${pal.borderActive}`
                          : isNeighbor
                            ? neighborWarning
                              ? 'ring-4 ring-rose-500 border-rose-600 bg-rose-50 shadow-md z-10'
                              : 'ring-2 ring-blue-400 border-blue-400 shadow-xs'
                            : 'hover:shadow-md hover:scale-[1.01]'
                      } ${animBorder}`}
                    >
                      {/* Desk Header: ID and Subject Tag */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">
                          {String.fromCharCode(65 + r)}{c + 1}
                        </span>
                        <div className={`w-5 h-5 rounded-md ${pal.avatar} flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                          {deskCell.subjectName.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Subject Name Content */}
                      <div className="my-auto text-center px-1">
                        <p className={`text-xs sm:text-sm font-bold leading-tight truncate ${pal.text}`} title={deskCell.subjectName}>
                          {deskCell.subjectName}
                        </p>
                        <span className="inline-block text-[10px] text-slate-500 font-medium mt-0.5">
                          Seat #{r * cols + c + 1}
                        </span>
                      </div>

                      {/* Bottom Status Indicator */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pal.hex }} />
                          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Assigned</span>
                        </div>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      </div>

                      {/* Conflict Alert Flag on Neighbor */}
                      {neighborWarning && (
                        <div className="absolute -top-2.5 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                          <AlertTriangle className="w-2.5 h-2.5" /> Adjacency Conflict
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adjacency Inspector Interactive Prompt */}
      {hoveredDesk && (
        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Inspecting Desk <strong>{String.fromCharCode(65 + hoveredDesk.r)}{hoveredDesk.c + 1}</strong> (Row {hoveredDesk.r + 1}, Col {hoveredDesk.c + 1}):
              {grid && grid[hoveredDesk.r][hoveredDesk.c] ? (
                <span className="ml-1">
                  Occupied by <strong>{grid[hoveredDesk.r][hoveredDesk.c].subjectName}</strong>. All 8 surrounding dashed desks have zero students from this subject!
                </span>
              ) : (
                <span className="ml-1 text-slate-600">Empty desk. Free buffer zone.</span>
              )}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-[11px] shrink-0">
            Adjacency Verified ✓
          </span>
        </div>
      )}

      {/* Subject Distribution Summary Chips */}
      {subjects.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Enrolled Subjects:
          </span>
          {subjects.map((sub) => {
            const pal = getPaletteById(sub.color);
            const seated = placedCounts[sub.id] || 0;
            return (
              <div
                key={sub.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${pal.badge}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pal.hex }} />
                <span>{sub.name}:</span>
                <span className="font-bold text-slate-800">
                  {seated} / {sub.count} seated
                </span>
              </div>
            );
          })}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Empty Desks: <strong>{grid ? stats.emptyDesks : rows * cols}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
