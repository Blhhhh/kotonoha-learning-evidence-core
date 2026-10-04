# Kotonoha Learning Evidence Core

Kotonoha Learning Evidence Core is a small TypeScript library that marks three narrowly defined Japanese surface forms with exact UTF-16 spans. It also maps unmatched text to explicit UNKNOWN regions and validates caller-supplied reading segments. It does not parse Japanese or judge whether a sentence is correct.

## API

- `findLearningOccurrences(text)`: marks only the three narrow forms in [rule definitions](docs/rules.md).
- `buildPartialSentenceMap(text)`: covers the entire source with KNOWN and UNKNOWN chunks.
- `validateLearningObject(value)`: checks exact structural and provenance contracts.
- `validateReading(text, segments)`: validates caller-supplied segments; it does not generate readings.

All offsets are JavaScript UTF-16 code units and may be used with `text.slice(start, end)`. A match is surface evidence, not a linguistic correctness verdict. See [limitations](docs/limitations.md) and [reconstruction provenance](docs/provenance.md).

## Quick start

```ts
import { findLearningOccurrences, buildPartialSentenceMap } from '@kotonoha/learning-evidence-core';

const text = '白い紙を読みたい。';
const occurrences = findLearningOccurrences(text);
const map = buildPartialSentenceMap(text);
console.log(occurrences.map(item => text.slice(item.span.start, item.span.end)));
console.log(map.status);
```

See [Apache-2.0](LICENSE) for the license.

## Local verification

```sh
npm ci
npm run typecheck
npm test
npm run build
npm pack --dry-run
npm run check:consumer
npm run check:privacy
```
