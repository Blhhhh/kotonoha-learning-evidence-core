import test from 'node:test';
import assert from 'node:assert/strict';
import { findLearningOccurrences } from '../src/index.ts';
import { fixtures } from './fixtures.ts';

test('fixture manifest contains 34 distinct approved synthetic cases', () => {
  assert.equal(fixtures.length, 34);
  assert.equal(new Set(fixtures.map(f => f.id)).size, 34);
});

for (const fixture of fixtures) {
  test(`${fixture.id}: exact ordered surface evidence`, () => {
    assert.equal(fixture.provenance, 'synthetic_for_oss_clean_reconstruction');
    const actual = findLearningOccurrences(fixture.text);
    assert.deepEqual(actual.map(hit => ({ ruleId: hit.ruleId, text: hit.span.text })), fixture.expected, fixture.id);
    for (const hit of actual) {
      assert.equal(fixture.text.slice(hit.span.start, hit.span.end), hit.span.text, fixture.id);
      assert.deepEqual(hit.provenance, { source: 'deterministic_rule', ruleId: hit.ruleId, ruleVersion: '1' });
    }
  });
}

test('removed contextual rules never emit evidence', () => {
  assert.deepEqual(findLearningOccurrences('箱を持ってくる。どうするんだろう。'), []);
});

test('same input produces identical ordered evidence', () => {
  const text = fixtures.find(f => f.id === 'F29')!.text;
  assert.deepEqual(findLearningOccurrences(text), findLearningOccurrences(text));
  assert.deepEqual(findLearningOccurrences(text).map(hit => hit.ruleId), ['grammar.tai', 'grammar.kamoshirenai']);
});

test('input limit is enforced', () => {
  assert.throws(() => findLearningOccurrences(''), RangeError);
  assert.throws(() => findLearningOccurrences('あ'.repeat(20_001)), RangeError);
});
