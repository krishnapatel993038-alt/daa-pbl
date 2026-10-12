/**
 * Backtracking Exam Seating Arrangement Solver
 * 
 * Rules:
 * - A grid of size rows x cols represents exam desks.
 * - Each desk can hold at most 1 student from a subject or be empty.
 * - Constraint (Anti-Cheating): No two students of the SAME subject can be placed
 *   in adjacent desks (horizontally, vertically, or diagonally - 8 neighbor directions).
 * - Algorithmic approach: Recursive Backtracking cell by cell (0 to rows*cols - 1).
 */

// 8 neighbor directions: N, S, E, W, NW, NE, SW, SE
export const NEIGHBOR_DIRECTIONS = [
  [-1, 0],  // North
  [1, 0],   // South
  [0, 1],   // East
  [0, -1],  // West
  [-1, -1], // North-West
  [-1, 1],  // North-East
  [1, -1],  // South-West
  [1, 1],   // South-East
];

/**
 * Checks if placing a student of subjectId at grid[row][col] is safe.
 * Inspects all 8 adjacent neighbors.
 */
export function isSafe(grid, row, col, subjectId, rows, cols) {
  for (const [dRow, dCol] of NEIGHBOR_DIRECTIONS) {
    const nRow = row + dRow;
    const nCol = col + dCol;

    // Check if neighbor is within grid bounds
    if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
      const neighbor = grid[nRow][nCol];
      if (neighbor !== null && neighbor.subjectId === subjectId) {
        return false; // Conflict found in 8-neighborhood
      }
    }
  }
  return true;
}

/**
 * Checks theoretical upper bounds to fail fast before deep recursion
 * e.g., in an R x C grid, the maximum independent set under 8-adjacency (King's graph)
 * is ceil(R/2) * ceil(C/2). No single subject can have more students than this.
 */
export function validateTheoreticalFeasibility(rows, cols, subjects) {
  const totalDesks = rows * cols;
  const totalStudents = subjects.reduce((sum, s) => sum + (Number(s.count) || 0), 0);

  if (totalStudents > totalDesks) {
    return {
      feasible: false,
      reason: `Total students (${totalStudents}) exceeds total available desks (${totalDesks}).`,
    };
  }

  // Maximum desks for any single subject without 8-adjacency conflict
  const maxIndependentDesks = Math.ceil(rows / 2) * Math.ceil(cols / 2);
  for (const s of subjects) {
    const count = Number(s.count) || 0;
    if (count > maxIndependentDesks) {
      return {
        feasible: false,
        reason: `Subject "${s.name}" has ${count} students, but a ${rows}x${cols} room can at most seat ${maxIndependentDesks} students from the same subject without 8-neighbor adjacency (King's graph independence limit).`,
      };
    }
  }

  return { feasible: true };
}

/**
 * Synchronous Solver using recursive backtracking.
 * Returns { success, grid, stats, error }
 */
export function solveSeatingArrangement(rows, cols, subjectsList) {
  const startTime = performance.now();
  
  // Clone and sanitize subjects
  const subjects = subjectsList
    .map(s => ({
      id: s.id,
      name: s.name,
      count: Math.max(0, parseInt(s.count, 10) || 0),
      color: s.color,
    }))
    .filter(s => s.count > 0);

  const totalDesks = rows * cols;
  const totalStudents = subjects.reduce((sum, s) => sum + s.count, 0);

  // Fast pre-check
  const preCheck = validateTheoreticalFeasibility(rows, cols, subjects);
  if (!preCheck.feasible) {
    return {
      success: false,
      grid: null,
      stats: { steps: 0, backtracks: 0, durationMs: performance.now() - startTime },
      error: preCheck.reason,
    };
  }

  // Initialize empty grid (rows x cols)
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

  // Subject remaining count tracker
  const remainingCounts = {};
  for (const s of subjects) {
    remainingCounts[s.id] = s.count;
  }

  let steps = 0;
  let backtracks = 0;
  const maxSteps = 1000000; // safety ceiling against runaway recursion

  // Recursive backtracking function cell by cell
  function backtrack(cellIndex, remainingTotalStudents) {
    steps++;
    if (steps > maxSteps) {
      return false;
    }

    // BASE CASE 1: All students successfully placed!
    if (remainingTotalStudents === 0) {
      return true;
    }

    // BASE CASE 2: Reached end of grid but students remain
    if (cellIndex >= totalDesks) {
      return false;
    }

    const remainingCells = totalDesks - cellIndex;
    // PRUNING: Not enough cells left to place remaining students
    if (remainingCells < remainingTotalStudents) {
      return false;
    }

    const r = Math.floor(cellIndex / cols);
    const c = cellIndex % cols;

    // Sort subjects by remaining count descending (Most Constrained First heuristic)
    const availableSubjects = subjects
      .filter(s => remainingCounts[s.id] > 0)
      .sort((a, b) => remainingCounts[b.id] - remainingCounts[a.id]);

    // Try placing each valid subject in current desk
    for (const sub of availableSubjects) {
      if (isSafe(grid, r, c, sub.id, rows, cols)) {
        // CHOOSE
        grid[r][c] = {
          subjectId: sub.id,
          subjectName: sub.name,
          color: sub.color,
        };
        remainingCounts[sub.id]--;

        // EXPLORE
        if (backtrack(cellIndex + 1, remainingTotalStudents - 1)) {
          return true;
        }

        // UNCHOOSE (Backtrack)
        grid[r][c] = null;
        remainingCounts[sub.id]++;
        backtracks++;
      }
    }

    // If remaining desks strictly exceed remaining students, we can also try leaving this desk empty
    if (remainingCells > remainingTotalStudents) {
      grid[r][c] = null;
      if (backtrack(cellIndex + 1, remainingTotalStudents)) {
        return true;
      }
      backtracks++;
    }

    return false;
  }

  const foundSolution = backtrack(0, totalStudents);
  const durationMs = performance.now() - startTime;

  if (foundSolution) {
    return {
      success: true,
      grid,
      stats: {
        steps,
        backtracks,
        durationMs: Math.round(durationMs * 100) / 100,
        totalDesks,
        totalStudents,
        emptyDesks: totalDesks - totalStudents,
      },
      error: null,
    };
  }

  return {
    success: false,
    grid: null,
    stats: {
      steps,
      backtracks,
      durationMs: Math.round(durationMs * 100) / 100,
      totalDesks,
      totalStudents,
      emptyDesks: totalDesks - totalStudents,
    },
    error: steps > maxSteps
      ? `Computation step limit reached (${maxSteps} steps). The arrangement appears too constrained for the current grid dimensions.`
      : `No conflict-free seating arrangement is possible for this student combination on a ${rows}x${cols} grid. Try increasing grid dimensions or balancing subject counts.`,
  };
}

/**
 * Step generator for visual / animated step-by-step solving.
 * Yields every step: { type: 'try'|'safe'|'conflict'|'placed'|'backtrack'|'done'|'fail', r, c, subject, grid }
 */
export function* createBacktrackingGenerator(rows, cols, subjectsList, maxVisualSteps = 2500) {
  const subjects = subjectsList
    .map(s => ({
      id: s.id,
      name: s.name,
      count: Math.max(0, parseInt(s.count, 10) || 0),
      color: s.color,
    }))
    .filter(s => s.count > 0);

  const totalDesks = rows * cols;
  const totalStudents = subjects.reduce((sum, s) => sum + s.count, 0);

  const preCheck = validateTheoreticalFeasibility(rows, cols, subjects);
  if (!preCheck.feasible) {
    yield {
      type: 'error',
      message: preCheck.reason,
    };
    return;
  }

  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  const remainingCounts = {};
  for (const s of subjects) {
    remainingCounts[s.id] = s.count;
  }

  let stepCount = 0;
  let backtrackCount = 0;

  function* backtrackGen(cellIndex, remainingTotalStudents) {
    stepCount++;
    if (stepCount > maxVisualSteps) {
      return false;
    }

    if (remainingTotalStudents === 0) {
      yield {
        type: 'done',
        grid: grid.map(row => [...row]),
        stepCount,
        backtrackCount,
      };
      return true;
    }

    if (cellIndex >= totalDesks) return false;

    const remainingCells = totalDesks - cellIndex;
    if (remainingCells < remainingTotalStudents) return false;

    const r = Math.floor(cellIndex / cols);
    const c = cellIndex % cols;

    const availableSubjects = subjects
      .filter(s => remainingCounts[s.id] > 0)
      .sort((a, b) => remainingCounts[b.id] - remainingCounts[a.id]);

    for (const sub of availableSubjects) {
      const safe = isSafe(grid, r, c, sub.id, rows, cols);

      yield {
        type: safe ? 'inspect-safe' : 'inspect-conflict',
        r,
        c,
        subject: sub,
        grid: grid.map(row => [...row]),
        stepCount,
        backtrackCount,
      };

      if (safe) {
        grid[r][c] = {
          subjectId: sub.id,
          subjectName: sub.name,
          color: sub.color,
        };
        remainingCounts[sub.id]--;

        yield {
          type: 'placed',
          r,
          c,
          subject: sub,
          grid: grid.map(row => [...row]),
          stepCount,
          backtrackCount,
        };

        const result = yield* backtrackGen(cellIndex + 1, remainingTotalStudents - 1);
        if (result) return true;

        // Backtrack
        grid[r][c] = null;
        remainingCounts[sub.id]++;
        backtrackCount++;

        yield {
          type: 'backtrack',
          r,
          c,
          subject: sub,
          grid: grid.map(row => [...row]),
          stepCount,
          backtrackCount,
        };
      }
    }

    // Try leaving empty
    if (remainingCells > remainingTotalStudents) {
      grid[r][c] = null;
      yield {
        type: 'try-empty',
        r,
        c,
        grid: grid.map(row => [...row]),
        stepCount,
        backtrackCount,
      };

      const result = yield* backtrackGen(cellIndex + 1, remainingTotalStudents);
      if (result) return true;

      backtrackCount++;
    }

    return false;
  }

  const success = yield* backtrackGen(0, totalStudents);
  if (!success) {
    yield {
      type: 'failed',
      message: stepCount > maxVisualSteps 
        ? 'Visual step limit reached. Switching to instant solve recommended.'
        : 'No valid seating arrangement found.',
      stepCount,
      backtrackCount,
    };
  }
}
