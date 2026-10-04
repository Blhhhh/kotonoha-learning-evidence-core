import { validateReading } from '../src/index.ts';

console.log(validateReading('そらは青い。', [
  { start: 0, end: 3, text: 'そらは', reading: 'そらは' },
  { start: 3, end: 5, text: '青い', reading: 'あおい' },
  { start: 5, end: 6, text: '。', reading: null },
]));
