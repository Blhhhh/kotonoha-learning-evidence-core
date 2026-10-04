# Reconstruction provenance

Reconstruction date: 2026-10-04 (Asia/Shanghai). The Founder approved Apache-2.0 for this reviewed candidate on 2026-10-04. Publication had not occurred as of that decision.

During this reconstruction pass, no private learner corpus, commercial rule code, commercial rule tests, old OSS rule fixtures, or commercial explanations were consulted. Rule logic and all 34 Japanese fixture texts were newly written. The same assistant had encountered commercial rule code in an earlier, separate audit; this pass therefore cannot honestly claim a fully blind independent reviewer. The new public candidate uses no finite stem inventory and contains no copied code or example text from that audit.

| Rule | Newly authored logic and fixture group | Public fact checked |
| --- | --- | --- |
| `grammar.tai` | Adjacent object particle, character-shape candidate stem, exact `たい` and right edge; F02–F13, F29–F30, F33. | Japan Foundation [Vたいです](https://www.kyozai.jpf.go.jp/kyozai/material/BTS00131/ja/render.do): desire attaches to a verb's ます-stem. This implementation does not certify verb status. |
| `grammar.you_ni_naru` | Two literal `できるように...` forms and right edge; F16, F19–F23, F30. | Japan Foundation [Vようになります](https://www.kyozai.jpf.go.jp/kyozai/material/BTS00086/ja/render.do): change into an ability or habitual state. TUFS [potential forms](https://www.coelang.tufs.ac.jp/mt/ja/gmod/contents/explanation/074.html): `できる` is the potential of `する`. |
| `grammar.kamoshirenai` | Two marker literals with left and right surface boundaries; F24–F29, F31–F32. | TUFS [かもしれない](https://www.coelang.tufs.ac.jp/mt/ja/gmod/contents/explanation/076.html): plain and polite possibility forms. |
| Removed `grammar.te_kuru` | No detector; negative guard test. | TUFS [Vていきます / Vてきます](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c02/lesson45/step1/explanation/087.html): movement and change uses require contextual distinction. |
| Removed `grammar.n_darou` | No detector; negative guard test. | General grammatical judgment only; no external text copied. |

The links were used to verify the stated grammatical facts. No wording or example sentence was copied from them. Exact spans, UTF-16 units, provenance fields, Sentence Map structure, and reading validation are retained API behavior, not reconstructed grammar.
