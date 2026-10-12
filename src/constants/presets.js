export const PRESETS = [
  {
    id: 'standard',
    name: 'Standard Exam (4×5)',
    description: '3 subjects (Math, Science, History) with 15 students in a 20-desk hall.',
    rows: 4,
    cols: 5,
    subjects: [
      { id: 'sub-1', name: 'Mathematics', count: 6, color: 'blue' },
      { id: 'sub-2', name: 'Science', count: 5, color: 'emerald' },
      { id: 'sub-3', name: 'History', count: 4, color: 'amber' },
    ],
  },
  {
    id: 'university_hall',
    name: 'University Finals (5×6)',
    description: '4 subjects with 24 students in a 30-desk lecture hall.',
    rows: 5,
    cols: 6,
    subjects: [
      { id: 'sub-1', name: 'Data Structures', count: 8, color: 'violet' },
      { id: 'sub-2', name: 'Algorithms', count: 7, color: 'cyan' },
      { id: 'sub-3', name: 'Operating Systems', count: 5, color: 'emerald' },
      { id: 'sub-4', name: 'Computer Networks', count: 4, color: 'orange' },
    ],
  },
  {
    id: 'tight_capacity',
    name: 'Max Density (4×4)',
    description: '4 subjects packed into 16 desks (100% capacity check).',
    rows: 4,
    cols: 4,
    subjects: [
      { id: 'sub-1', name: 'Physics', count: 4, color: 'blue' },
      { id: 'sub-2', name: 'Chemistry', count: 4, color: 'emerald' },
      { id: 'sub-3', name: 'Biology', count: 4, color: 'amber' },
      { id: 'sub-4', name: 'English', count: 4, color: 'rose' },
    ],
  },
  {
    id: 'impossible_overcrowded',
    name: 'Impossible Case (3×3 King Graph)',
    description: 'Mathematics has 6 students in 3×3 grid. (Max 8-independent set is only 4!).',
    rows: 3,
    cols: 3,
    subjects: [
      { id: 'sub-1', name: 'Mathematics', count: 6, color: 'rose' },
      { id: 'sub-2', name: 'Physics', count: 2, color: 'blue' },
    ],
  },
  {
    id: 'sparse_classroom',
    name: 'Social Distanced (5×5)',
    description: '10 students across 25 desks with ample buffer space.',
    rows: 5,
    cols: 5,
    subjects: [
      { id: 'sub-1', name: 'AI & ML', count: 4, color: 'violet' },
      { id: 'sub-2', name: 'Cyber Security', count: 3, color: 'teal' },
      { id: 'sub-3', name: 'Cloud Computing', count: 3, color: 'cyan' },
    ],
  },
];
