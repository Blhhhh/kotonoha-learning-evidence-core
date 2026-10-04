import test from 'node:test';
import assert from 'node:assert/strict';
import { findLearningOccurrences, buildPartialSentenceMap, validateLearningObject, validateReading } from '../src/index.ts';
import { fixtures } from './fixtures.ts';

test('UTF-16 offsets remain exact after a surrogate pair', () => {
  const text = '🪴紙を読みたい。';
  const [hit] = findLearningOccurrences(text);
  assert.ok(hit);
  assert.equal(hit.span.start, 4);
  assert.equal(text.slice(hit.span.start, hit.span.end), '読みたい');
  assert.deepEqual(validateLearningObject(buildPartialSentenceMap(text)), { valid: true });
});

test('reading validation rejects a split surrogate pair', () => {
  const text = '🪴木';
  assert.deepEqual(validateReading(text, [
    { start: 0, end: 1, text: text.slice(0, 1), reading: null },
    { start: 1, end: 3, text: text.slice(1), reading: null },
  ]), { valid: false, reason: 'INVALID_BOUNDARY', index: 0 });
});

test('ASCII, Japanese scripts, emoji, spaces and punctuation preserve UTF-16 slices', () => {
  const text = fixtures.find(f => f.id === 'F34')!.text;
  const map = buildPartialSentenceMap(text);
  assert.equal(map.chunks.map(chunk => text.slice(chunk.span.start, chunk.span.end)).join(''), text);
  assert.equal(map.status, 'UNSUPPORTED');
  assert.equal(text.indexOf('🪴'), 4);
  assert.equal(text.slice(4, 6), '🪴');
});

test('combining mark and newline before a match preserve exact code-unit offsets', () => {
  const text = 'e\u0301\n' + fixtures.find(f => f.id === 'F02')!.text;
  const [hit] = findLearningOccurrences(text);
  assert.ok(hit);
  assert.equal(hit.span.start, 7);
  assert.equal(text.slice(hit.span.start, hit.span.end), '読みたい');
  assert.equal(buildPartialSentenceMap(text).chunks.map(chunk => chunk.span.text).join(''), text);
});
