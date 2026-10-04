import { validText, validSpan, type LearningObject, type MapChunk, type Occurrence, type RuleId } from './contracts.ts';
import { findLearningOccurrences } from './occurrences.ts';

/** Structural projection of known spans and unknown gaps. This is not parsing. */
export function buildPartialSentenceMap(text: string, occurrences: readonly Occurrence[] = findLearningOccurrences(text)): LearningObject {
  if (!validText(text)) throw new RangeError('Expected 1–20000 UTF-16 code units of text');
  for (const item of occurrences) if (!validSpan(text, item.span) || item.evidence !== 'RULE_SUPPORTED' || item.provenance.ruleId !== item.ruleId || item.provenance.ruleVersion !== '1') throw new TypeError('Invalid occurrence for source text');
  if (JSON.stringify(occurrences) !== JSON.stringify(findLearningOccurrences(text))) throw new TypeError('Occurrences do not match current deterministic evidence');
  const ordered = [...occurrences].sort((a, b) => a.span.start - b.span.start || b.span.end - a.span.end || a.ruleId.localeCompare(b.ruleId));
  const groups: { start: number; end: number; ids: RuleId[] }[] = [];
  for (const o of ordered) {
    const last = groups.at(-1);
    if (last && o.span.start < last.end) {
      if (o.span.end > last.end) throw new TypeError('Crossing occurrence spans are unsupported');
      if (!last.ids.includes(o.ruleId)) last.ids.push(o.ruleId);
    } else groups.push({ start: o.span.start, end: o.span.end, ids: [o.ruleId] });
  }
  const chunks: MapChunk[] = [];
  let cursor = 0;
  const add = (start: number, end: number, kind: MapChunk['kind'], ids: RuleId[]) => {
    if (end > start) chunks.push({ kind, span: { start, end, text: text.slice(start, end) }, evidence: kind === 'KNOWN' ? 'RULE_SUPPORTED' : 'UNKNOWN', occurrenceIds: ids });
  };
  for (const g of groups) { add(cursor, g.start, 'UNKNOWN', []); add(g.start, g.end, 'KNOWN', g.ids); cursor = g.end; }
  add(cursor, text.length, 'UNKNOWN', []);
  const status = groups.length === 0 ? 'UNSUPPORTED' : chunks.some(c => c.kind === 'UNKNOWN') ? 'PARTIALLY_SUPPORTED' : 'SUPPORTED';
  return { schemaVersion: 1, text, status, occurrences: [...ordered], chunks };
}
