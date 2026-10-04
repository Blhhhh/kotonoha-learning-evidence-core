import { validText, type Occurrence, type RuleId } from './contracts.ts';

type Candidate = { ruleId: RuleId; start: number; end: number; displayForm: string };
const leftText = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const rightEdge = /[\s。！？、,.!?」』）)]/u;

function atRightEdge(text: string, end: number): boolean {
  return end === text.length || rightEdge.test(text[end] ?? '');
}

function candidates(text: string): Candidate[] {
  const found: Candidate[] = [];
  // An explicit ability predicate makes this a bounded subset of V-ようになる.
  for (const form of ['できるようになった', 'できるようになる'] as const) {
    let from = 0;
    while ((from = text.indexOf(form, from)) !== -1) {
      const end = from + form.length;
      if (atRightEdge(text, end)) {
        found.push({ ruleId: 'grammar.you_ni_naru', start: from, end, displayForm: 'できるようになる' });
      }
      from = end;
    }
  }

  // Markers only: no claim is made about the truth or scope of the preceding clause.
  for (const form of ['かもしれません', 'かもしれない'] as const) {
    let from = 0;
    while ((from = text.indexOf(form, from)) !== -1) {
      const end = from + form.length;
      if (from > 0 && leftText.test(text[from - 1] ?? '') && atRightEdge(text, end)) {
        found.push({ ruleId: 'grammar.kamoshirenai', start: from, end, displayForm: 'かもしれない' });
      }
      from = end;
    }
  }

  // Written object-particle construction. The stem is a surface candidate.
  const objectDesire = /を((?:[\p{Script=Han}]{1,2}[\p{Script=Hiragana}]{0,4}|[\p{Script=Hiragana}]{1,4}))たい/gu;
  for (const match of text.matchAll(objectDesire)) {
    const start = match.index + 1;
    const end = match.index + match[0].length;
    if (atRightEdge(text, end)) found.push({ ruleId: 'grammar.tai', start, end, displayForm: '〜たい' });
  }
  return found;
}

/** Surface evidence only; UTF-16 spans can be checked with text.slice. */
export function findLearningOccurrences(text: string): Occurrence[] {
  if (!validText(text)) throw new RangeError('Expected 1–20000 UTF-16 code units of text');
  const unique = new Map<string, Candidate>();
  for (const hit of candidates(text)) unique.set(`${hit.ruleId}:${hit.start}:${hit.end}`, hit);
  return [...unique.values()].sort((a, b) => a.start - b.start || b.end - a.end || a.ruleId.localeCompare(b.ruleId)).slice(0, 128).map(hit => ({
    ruleId: hit.ruleId,
    displayForm: hit.displayForm,
    span: { start: hit.start, end: hit.end, text: text.slice(hit.start, hit.end) },
    evidence: 'RULE_SUPPORTED',
    provenance: { source: 'deterministic_rule', ruleId: hit.ruleId, ruleVersion: '1' },
  }));
}
