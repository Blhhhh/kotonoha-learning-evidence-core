import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPartialSentenceMap, validateLearningObject } from '../src/index.ts';

const makeValid = () => buildPartialSentenceMap('白い紙を読みたい。');

test('validator accepts a generated learning object', () => {
  assert.deepEqual(validateLearningObject(makeValid()), { valid: true });
});

test('validator rejects changed source and invented rule evidence', () => {
  const valid = makeValid();
  assert.equal(validateLearningObject({ ...valid, text: '別の文。' }).valid, false);
  const changed = structuredClone(valid);
  changed.occurrences[0]!.ruleId = 'grammar.te_kuru' as never;
  assert.equal(validateLearningObject(changed).valid, false);
});

test('validator rejects fabricated UTF-16 offsets', () => {
  const changed = structuredClone(makeValid());
  changed.occurrences[0]!.span.start += 1;
  assert.equal(validateLearningObject(changed).valid, false);
});

test('validator rejects invented fields and status claims', () => {
  const valid = makeValid();
  assert.deepEqual(validateLearningObject({ ...valid, extra: true }), { valid: false, issues: ['INVALID_OBJECT_SHAPE'] });
  assert.equal(validateLearningObject({ ...valid, status: 'SUPPORTED' }).valid, false);
  const changed = structuredClone(valid);
  changed.chunks[0]!.kind = 'KNOWN';
  assert.equal(validateLearningObject(changed).valid, false);
});

test('validator rejects altered rule provenance', () => {
  const changed = structuredClone(makeValid());
  changed.occurrences[0]!.provenance.ruleVersion = '2' as never;
  assert.equal(validateLearningObject(changed).valid, false);
});
