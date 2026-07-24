#!/usr/bin/env node
/**
 * @deprecated Do not use for production meanings.
 * HI-equivalent regional meanings are produced by:
 *   python scripts/complete_hi_equivalent_meanings.py
 *   (or scripts/translate_meanings_hi_equivalent.py)
 *
 * This stub exits to prevent reintroducing English [LOC·MT] drafts.
 */
console.error(
  "Refusing to overwrite regional meanings with English stubs.\n" +
    "Use: python scripts/complete_hi_equivalent_meanings.py",
);
process.exit(1);
