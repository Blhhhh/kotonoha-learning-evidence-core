/** Exact offsets are UTF-16 code units, as used by JavaScript string.slice. */
export type Span = { start: number; end: number; text: string };
export type EvidenceLevel = 'RULE_SUPPORTED' | 'UNKNOWN';
export type SupportStatus = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'UNSUPPORTED';
export type RuleId = 'grammar.you_ni_naru' | 'grammar.tai' | 'grammar.kamoshirenai';
export type Occurrence = {
  ruleId: RuleId;
  displayForm: string;
  span: Span;
  evidence: 'RULE_SUPPORTED';
  provenance: { source: 'deterministic_rule'; ruleId: RuleId; ruleVersion: '1' };
};
export type MapChunk = { kind: 'KNOWN' | 'UNKNOWN'; span: Span; evidence: EvidenceLevel; occurrenceIds: RuleId[] };
export type LearningObject = { schemaVersion: 1; text: string; status: SupportStatus; occurrences: Occurrence[]; chunks: MapChunk[] };
export type Validation = { valid: true } | { valid: false; issues: string[] };

const RULES = new Set<RuleId>(['grammar.you_ni_naru', 'grammar.tai', 'grammar.kamoshirenai']);
const object = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const exactKeys = (x: Record<string, unknown>, keys: string[]) => Object.keys(x).sort().join('|') === keys.sort().join('|');
export function validText(text: unknown): text is string { return typeof text === 'string' && text.length > 0 && text.length <= 20_000; }
export function validSpan(text: string, span: unknown): span is Span {
  return object(span) && exactKeys(span, ['start', 'end', 'text']) && Number.isInteger(span.start) && Number.isInteger(span.end)
    && (span.start as number) >= 0 && (span.end as number) > (span.start as number)
    && (span.end as number) <= text.length && typeof span.text === 'string'
    && !splitsSurrogate(text, span.start as number) && !splitsSurrogate(text, span.end as number)
    && text.slice(span.start as number, span.end as number) === span.text;
}
function splitsSurrogate(text: string, at: number): boolean {
  return at > 0 && at < text.length && text.charCodeAt(at - 1) >= 0xd800 && text.charCodeAt(at - 1) <= 0xdbff
    && text.charCodeAt(at) >= 0xdc00 && text.charCodeAt(at) <= 0xdfff;
}

/** Structural validation only; this does not certify linguistic correctness. */
export function validateLearningObject(value: unknown): Validation {
  const issues: string[] = [];
  if (!object(value) || !exactKeys(value, ['schemaVersion', 'text', 'status', 'occurrences', 'chunks'])) return { valid: false, issues: ['INVALID_OBJECT_SHAPE'] };
  if (value.schemaVersion !== 1) issues.push('INVALID_SCHEMA_VERSION');
  if (!validText(value.text)) return { valid: false, issues: [...issues, 'INVALID_TEXT'] };
  const text = value.text;
  if (!['SUPPORTED', 'PARTIALLY_SUPPORTED', 'UNSUPPORTED'].includes(value.status as string)) issues.push('INVALID_STATUS');
  if (!Array.isArray(value.occurrences) || !Array.isArray(value.chunks)) return { valid: false, issues: [...issues, 'INVALID_COLLECTIONS'] };
  if (value.occurrences.length > 128 || value.chunks.length > 257) issues.push('COLLECTION_LIMIT');
  for (const occurrence of value.occurrences) {
    if (!object(occurrence) || !exactKeys(occurrence, ['ruleId', 'displayForm', 'span', 'evidence', 'provenance']) || !RULES.has(occurrence.ruleId as RuleId)
      || typeof occurrence.displayForm !== 'string' || !validSpan(text, occurrence.span) || occurrence.evidence !== 'RULE_SUPPORTED'
      || !object(occurrence.provenance) || !exactKeys(occurrence.provenance, ['source', 'ruleId', 'ruleVersion'])
      || occurrence.provenance.source !== 'deterministic_rule' || occurrence.provenance.ruleId !== occurrence.ruleId || occurrence.provenance.ruleVersion !== '1') issues.push('INVALID_OCCURRENCE');
  }
  let cursor = 0; let known = 0; let unknown = 0;
  for (const chunk of value.chunks) {
    if (!object(chunk) || !exactKeys(chunk, ['kind', 'span', 'evidence', 'occurrenceIds']) || !validSpan(text, chunk.span)
      || !Array.isArray(chunk.occurrenceIds) || chunk.occurrenceIds.some(id => !RULES.has(id))) { issues.push('INVALID_CHUNK'); continue; }
    const chunkSpan = chunk.span as Span;
    if (chunkSpan.start !== cursor) issues.push('MAP_GAP_OR_OVERLAP');
    cursor = chunkSpan.end;
    if (chunk.kind === 'KNOWN' && chunk.evidence === 'RULE_SUPPORTED' && chunk.occurrenceIds.length > 0) {
      known++;
      for (const id of chunk.occurrenceIds) if (!value.occurrences.some(o => object(o) && o.ruleId === id && validSpan(text, o.span)
        && (o.span as Span).start >= chunkSpan.start && (o.span as Span).end <= chunkSpan.end)) issues.push('UNBACKED_KNOWN_CHUNK');
    }
    else if (chunk.kind === 'UNKNOWN' && chunk.evidence === 'UNKNOWN' && chunk.occurrenceIds.length === 0) unknown++;
    else issues.push('INVALID_CHUNK_SEMANTICS');
  }
  if (cursor !== text.length) issues.push('INCOMPLETE_MAP');
  for (const o of value.occurrences) if (object(o) && validSpan(text, o.span)
    && !value.chunks.some(c => object(c) && c.kind === 'KNOWN' && validSpan(text, c.span)
      && (c.span as Span).start <= (o.span as Span).start && (c.span as Span).end >= (o.span as Span).end
      && Array.isArray(c.occurrenceIds) && c.occurrenceIds.includes(o.ruleId))) issues.push('UNMAPPED_OCCURRENCE');
  const expected = known === 0 ? 'UNSUPPORTED' : unknown === 0 ? 'SUPPORTED' : 'PARTIALLY_SUPPORTED';
  if (value.status !== expected) issues.push('STATUS_MISMATCH');
  return issues.length ? { valid: false, issues: [...new Set(issues)] } : { valid: true };
}
