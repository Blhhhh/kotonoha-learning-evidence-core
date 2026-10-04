import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReading } from '../src/index.ts';

test('accepts caller supplied complete reading segments', () => {
  const text = 'そらは青い。';
  assert.equal(validateReading(text, [
    { start: 0, end: 3, text: 'そらは', reading: 'そらは' },
    { start: 3, end: 5, text: '青い', reading: 'あおい' },
    { start: 5, end: 6, text: '。', reading: null },
  ]).valid, true);
});

test('rejects stale source text', () => {
  assert.deepEqual(validateReading('うみは青い。', [
    { start: 0, end: 3, text: 'そらは', reading: 'そらは' },
    { start: 3, end: 6, text: '青い。', reading: null },
  ]), { valid: false, reason: 'STALE_SOURCE_TEXT', index: 0 });
});

test('rejects a gap in caller-supplied segments', () => {
  assert.deepEqual(validateReading('そらは青い。', [
    { start: 0, end: 3, text: 'そらは', reading: 'そらは' },
    { start: 4, end: 6, text: 'い。', reading: null },
  ]), { valid: false, reason: 'NON_COVERING_SEGMENTS', index: 1 });
});

test('rejects a non-kana reading', () => {
  assert.deepEqual(validateReading('木', [{ start: 0, end: 1, text: '木', reading: 'tree' }]), { valid: false, reason: 'INVALID_READING', index: 0 });
});

test('rejects a non-integer boundary', () => {
  assert.deepEqual(validateReading('木', [{ start: 0, end: 0.5, text: '木', reading: null }]), { valid: false, reason: 'INVALID_SEGMENT', index: 0 });
});

test('rejects incomplete final coverage', () => {
  assert.deepEqual(validateReading('そらは青い。', [
    { start: 0, end: 3, text: 'そらは', reading: 'そらは' },
  ]), { valid: false, reason: 'NON_COVERING_SEGMENTS' });
});
