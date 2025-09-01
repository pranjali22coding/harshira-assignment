# Hashira Placements Assignment (Node.js)

This repo contains a Node.js solution that:
- Parses polynomial roots from JSON (base/value pairs).
- Converts each value using explicit radix with `parseInt`.
- Verifies `n` and `k` and computes coefficients for `P(x) = ∏(x − r_i)`.

## Files
- solve.js — main program.
- case1.json, case2.json — sample test cases from prompt.
- out_case1.json, out_case2.json — program outputs for the cases.

## Run
# With a file:
node solve.js case1.json
node solve.js case2.json

# With stdin (paste then Ctrl+D / EOF):
cat case1.json | node solve.js

## Output
The program prints JSON with:
- parsed_roots_decimal: decimal roots array.
- n, k, enough_roots: check per prompt.
- coefficients_desc: coefficients in descending-power order if enough_roots is true.

## Notes
- `parseInt` is always called with an explicit radix for correct base conversion.
- Coefficients use polynomial multiplication (convolution) equivalent to Vieta.

