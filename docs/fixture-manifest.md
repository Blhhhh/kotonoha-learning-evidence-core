# Fixture manifest

All 34 fixture texts in `tests/fixtures.ts` were written anew on 2026-10-04 and carry `provenance: synthetic_for_oss_clean_reconstruction`. They are short synthetic Japanese sentences, with no quotation source or personal history.

| IDs | Purpose |
| --- | --- |
| F02–F07, F13 | Narrow `たい` positives and Unicode prefix |
| F08–F12 | `たい` negatives and excluded inflections |
| F16, F19, F23 | Narrow `ようになる` positives |
| F20–F22 | `ようになる` exclusions and right boundary |
| F24–F25, F31–F32 | `かもしれない` positives and Unicode prefix |
| F26–F28 | `かもしれない` exclusions and boundaries |
| F29–F30, F33 | Mixed supported and UNKNOWN text |
| F01, F14, F15, F17, F18, F34 | Rewritten structural fixtures, independent of historical rule inventory |

## Non-rule candidate decisions

| Historical slot | Decision | Reason |
| --- | --- | --- |
| F01 | REWRITE | New unknown-only sentence tests the Sentence Map without grammar inventory. |
| F14 | REWRITE | New reading-validation source sentence is synthetic. |
| F15 | REWRITE | New second reading source checks stale text without grammar inventory. |
| F17 | REWRITE | New surrogate-pair sentence tests UTF-16 boundaries. |
| F18 | REWRITE | New differing source text tests stale-source rejection. |
| F34 | REWRITE | New Latin/Japanese/emoji mix tests unknown coverage. |

No earlier fixture wording was retained.
