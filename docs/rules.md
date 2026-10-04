# V0.1 rule boundaries

These are deterministic **surface observations**, not a tokenizer, parser, or Japanese correctness judgment. A matched span is evidence only for the limited form stated below. Unmatched text stays UNKNOWN.

| Rule ID | Decision | Minimum claim | Supported surface forms | Excluded forms | Boundary | Known false positives | Known false negatives | Why this scope |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `grammar.tai` | INCLUDE WITH NARROWER CLAIM | A written `を` is immediately followed by a short Han and/or hiragana candidate stem plus `たい`. The evidence span is the candidate stem and `たい`. | `を` + 1–2 Han characters with 0–4 hiragana, or 1–4 hiragana, then `たい`; next character is sentence punctuation, a comma, whitespace, closing quote/bracket, or end. | Other particles, separated objects and verbs, inflections such as `たかった`, `たいです`, long or katakana stems. | Requires adjacent `を`; right edge as stated. | A nonverb sequence after `を` that happens to fit the character pattern may be marked. | Many genuine desires without this exact spelling and adjacency. | No lexical inventory or verb certification is asserted. |
| `grammar.you_ni_naru` | INCLUDE WITH NARROWER CLAIM | The literal ability-change phrase is present. | `できるようになる`, `できるようになった`. | Other potential verbs, polite and negative inflections, `ようにする`. | Whole literal phrase; right edge as above. | A quote or metalinguistic mention may be marked. | Most valid `Vようになる` forms. | The fixed `できる` predicate avoids guessing an arbitrary potential verb. |
| `grammar.kamoshirenai` | INCLUDE WITH NARROWER CLAIM | A possibility marker is present after Japanese writing. | `かもしれない`, `かもしれません`. | Past, shortened, or other inflected markers. | Immediately preceding character must be Han, hiragana, or katakana; right edge as above. | A quotation or mentioned phrase may be marked. | Markers after whitespace or other characters, and other inflections. | Only the marker is highlighted; no claim about the preceding proposition is made. |
| `grammar.te_kuru` | REMOVE FROM V0.1 | No emitted claim. | None. | All `てくる` forms. | Not applicable. | None emitted. | All valid uses. | Movement and change readings need context this detector does not have. |
| `grammar.n_darou` | REMOVE FROM V0.1 | No emitted claim. | None. | All `んだろう` forms. | Not applicable. | None emitted. | All valid uses. | Colloquial segmentation and the speaker's inference are outside surface evidence. |

## New synthetic examples

| Rule | Positive | Negative near-match | Limit illustrated |
| --- | --- | --- | --- |
| `grammar.tai` | `白い紙を読みたい。` | `紙を読みたいです。` | Only the specified right boundary is supported. |
| `grammar.you_ni_naru` | `できるようになった。` | `できるようになります。` | Only two literal inflections are supported. |
| `grammar.kamoshirenai` | `青くなるかもしれない。` | `雨かもしれなかった。` | Past form is excluded. |
| Removed `grammar.te_kuru` | None | `箱を持ってくる。` | Context is required to classify its use. |
| Removed `grammar.n_darou` | None | `どうするんだろう。` | No occurrence is emitted. |

All example sentences in this document were newly authored for this reconstruction. The implementation is intentionally underinclusive. It must not be used to grade a learner's Japanese.
