import { solveSeatingArrangement, isSafe, NEIGHBOR_DIRECTIONS } from './src/algorithms/backtracking.js';
import { PRESETS } from './src/constants/presets.js';

console.log('--- Testing Backtracking Exam Seating Arrangement Solver ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
    passedTests++;
  }
}

// Helper to verify that NO two adjacent desks (8 directions) have the same subject
function verifyGridAntiCheating(grid, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell) {
        for (const [dr, dc] of NEIGHBOR_DIRECTIONS) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = grid[nr][nc];
            if (neighbor && neighbor.subjectId === cell.subjectId) {
              return { valid: false, conflictAt: [r, c], neighborAt: [nr, nc], subject: cell.subjectId };
            }
          }
        }
      }
    }
  }
  return { valid: true };
}

// TEST 1: Standard Preset (4x5, 3 subjects, 15 students)
console.log('\n[Test 1] Standard 4x5 Exam');
const standardPreset = PRESETS.find(p => p.id === 'standard');
const res1 = solveSeatingArrangement(standardPreset.rows, standardPreset.cols, standardPreset.subjects);
assert(res1.success === true, 'Standard preset should find a valid arrangement');
assert(res1.grid.length === 4 && res1.grid[0].length === 5, 'Grid dimensions should be 4x5');
const v1 = verifyGridAntiCheating(res1.grid, 4, 5);
assert(v1.valid === true, 'No 2 students of the same subject sit in 8-neighbor adjacent desks');
console.log(`Execution time: ${res1.stats.durationMs}ms, Steps: ${res1.stats.steps}, Backtracks: ${res1.stats.backtracks}`);

// TEST 2: Max Density (4x4, 4 subjects, 16 students = 100% capacity)
console.log('\n[Test 2] Max Density 4x4 (100% capacity)');
const tightPreset = PRESETS.find(p => p.id === 'tight_capacity');
const res2 = solveSeatingArrangement(tightPreset.rows, tightPreset.cols, tightPreset.subjects);
assert(res2.success === true, '4x4 full capacity should find a valid solution');
const v2 = verifyGridAntiCheating(res2.grid, 4, 4);
assert(v2.valid === true, '100% capacity grid satisfies 8-neighbor anti-cheating');

// TEST 3: University Finals (5x6, 4 subjects, 24 students)
console.log('\n[Test 3] University Finals 5x6');
const uniPreset = PRESETS.find(p => p.id === 'university_hall');
const res3 = solveSeatingArrangement(uniPreset.rows, uniPreset.cols, uniPreset.subjects);
assert(res3.success === true, '5x6 lecture hall finds valid arrangement');
const v3 = verifyGridAntiCheating(res3.grid, 5, 6);
assert(v3.valid === true, 'University finals satisfies 8-neighbor constraints');

// TEST 4: Impossible Case (3x3 with 6 students of Subject 1 - King graph limit is 4)
console.log('\n[Test 4] Impossible Case Detection');
const impossiblePreset = PRESETS.find(p => p.id === 'impossible_overcrowded');
const res4 = solveSeatingArrangement(impossiblePreset.rows, impossiblePreset.cols, impossiblePreset.subjects);
assert(res4.success === false, 'Impossible case must return success: false');
assert(res4.error !== null && typeof res4.error === 'string', 'Error message must be returned explaining impossibility');
console.log(`Returned error message: "${res4.error}"`);

// TEST 5: Overcapacity (students > desks)
console.log('\n[Test 5] Overcapacity Detection');
const res5 = solveSeatingArrangement(2, 2, [{ id: 's1', name: 'Math', count: 5, color: 'blue' }]);
assert(res5.success === false, 'Should fail when students > desks');
assert(res5.error.includes('exceeds'), 'Should specify capacity exceeded');

console.log(`\n🎉 All ${passedTests}/${totalTests} unit test assertions passed!`);
