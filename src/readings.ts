import { validText, type Span } from './contracts.ts';

export type ReadingSegment = Span & { reading: string | null };
export type ReadingFailure = 'INVALID_SOURCE' | 'INVALID_SEGMENT' | 'INVALID_BOUNDARY' | 'NON_COVERING_SEGMENTS' | 'STALE_SOURCE_TEXT' | 'INVALID_READING';
export type ReadingResult = { valid: true; segments: ReadingSegment[] } | { valid: false; reason: ReadingFailure; index?: number };
const kana = /^[ぁ-ゖァ-ヺー・\s]+$/u;
const boundary = (s: string, i: number) => i === 0 || i === s.length || !(s.charCodeAt(i - 1) >= 0xd800 && s.charCodeAt(i - 1) <= 0xdbff && s.charCodeAt(i) >= 0xdc00 && s.charCodeAt(i) <= 0xdfff);

/** Validate caller-supplied segments; no readings are generated. */
export function validateReading(text: string, segments: readonly ReadingSegment[]): ReadingResult {
  if (!validText(text)) return { valid: false, reason: 'INVALID_SOURCE' };
  if (!Array.isArray(segments) || segments.length === 0 || segments.length > 120) return { valid: false, reason: 'INVALID_SEGMENT' };
  let cursor = 0;
  for (const [index, s] of segments.entries()) {
    if (!s || !Number.isInteger(s.start) || !Number.isInteger(s.end) || typeof s.text !== 'string' || !s.text
      || !(s.reading === null || typeof s.reading === 'string') || s.start < 0 || s.end <= s.start || s.end > text.length) return { valid: false, reason: 'INVALID_SEGMENT', index };
    if (!boundary(text, s.start) || !boundary(text, s.end)) return { valid: false, reason: 'INVALID_BOUNDARY', index };
    if (s.start !== cursor) return { valid: false, reason: 'NON_COVERING_SEGMENTS', index };
    if (text.slice(s.start, s.end) !== s.text) return { valid: false, reason: 'STALE_SOURCE_TEXT', index };
    if (s.reading !== null && !kana.test(s.reading)) return { valid: false, reason: 'INVALID_READING', index };
    cursor = s.end;
  }
  if (cursor !== text.length) return { valid: false, reason: 'NON_COVERING_SEGMENTS' };
  return { valid: true, segments: segments.map(s => ({ ...s })) };
}
