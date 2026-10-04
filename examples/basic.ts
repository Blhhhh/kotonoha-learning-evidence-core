import { findLearningOccurrences, buildPartialSentenceMap } from '../src/index.ts';

const text = '白い紙を読みたい。';
console.log(findLearningOccurrences(text));
console.log(buildPartialSentenceMap(text));
