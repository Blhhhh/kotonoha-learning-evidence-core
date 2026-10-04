import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPartialSentenceMap, validateLearningObject } from '../src/index.ts';
import { fixtures } from './fixtures.ts';

test('map covers every fixture with supported and unknown spans', () => {
  for (const fixture of fixtures) {
    const map = buildPartialSentenceMap(fixture.text);
    assert.deepEqual(validateLearningObject(map), { valid: true }, fixture.id);
    assert.equal(map.chunks.map(c => c.span.text).join(''), fixture.text, fixture.id);
    assert.equal(map.occurrences.length, fixture.expected.length, fixture.id);
    assert.equal(map.status, fixture.expected.length ? 'PARTIALLY_SUPPORTED' : 'UNSUPPORTED', fixture.id);
  }
});

test('caller evidence must equal current deterministic evidence', () => {
  assert.throws(() => buildPartialSentenceMap('紙を読みたい。', []), TypeError);
});

test('supported spans and explicit unknown gaps reconstruct mixed text', () => {
  const text = fixtures.find(f => f.id === 'F29')!.text;
  const map = buildPartialSentenceMap(text);
  assert.equal(map.chunks.map(chunk => chunk.span.text).join(''), text);
  assert.deepEqual(map.chunks.filter(chunk => chunk.kind === 'KNOWN').map(chunk => chunk.span.text), ['読みたい', 'かもしれない']);
  assert.ok(map.chunks.some(chunk => chunk.kind === 'UNKNOWN'));
});

test('unsupported means no rule evidence, not absence of grammar', () => {
  const text = fixtures.find(f => f.id === 'F01')!.text;
  const map = buildPartialSentenceMap(text);
  assert.equal(map.status, 'UNSUPPORTED');
  assert.equal(map.occurrences.length, 0);
  assert.deepEqual(map.chunks.map(chunk => chunk.kind), ['UNKNOWN']);
});

test('source-mismatched evidence is rejected', () => {
  const source = fixtures.find(f => f.id === 'F02')!.text;
  const other = fixtures.find(f => f.id === 'F03')!.text;
  assert.throws(() => buildPartialSentenceMap(other, buildPartialSentenceMap(source).occurrences), TypeError);
});
