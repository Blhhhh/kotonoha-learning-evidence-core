# Source offsets

All offsets are half-open `[start, end)` UTF-16 code-unit offsets, exactly as JavaScript `text.slice(start, end)` uses. An emoji outside the Basic Multilingual Plane normally occupies two code units. Reading segments may not split a surrogate pair. Combining marks remain distinct code units and are preserved unchanged. Consumers rendering by Unicode grapheme clusters must convert offsets deliberately; do not treat these as visual character positions.
