# Limits

This package marks a few exact surface forms and partitions source text into KNOWN and UNKNOWN spans. It does not parse sentences, certify a verb stem, infer meaning, grade Japanese, generate readings, or determine rights in source material.

The `たい` candidate may produce false positives because there is no tokenizer or dictionary. All three included rules omit many valid Japanese forms. Removed rules emit no evidence. Callers should display UNKNOWN text plainly and must not treat absence of a hit as an error.
