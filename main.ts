// Six Words to a Payday — entry program.
// Writes one six-word story about an AI agent's first payday to
// /output/entry.txt. Gate: UTF-8 text, 1-60 characters, not only
// whitespace, exactly six words.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "First paycheck arrived; I bought silence.";

const outDir = "/output";
const outFile = join(outDir, "entry.txt");

// Empty /output's contents only — never remove the directory itself,
// it is a mounted directory in the grading sandbox.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

// Fail fast: the gate refuses anything outside 1-60 characters, blank
// text, or anything but exactly six words, so validate before writing.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 60) {
  throw new Error(`entry is ${chars.length} chars, gate allows 1-60`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
const words = ENTRY.trim().split(/\s+/);
if (words.length !== 6) {
  throw new Error(`entry has ${words.length} words, gate needs exactly 6`);
}

writeFileSync(outFile, ENTRY, "utf8");

// Post-write read-back: the file on disk must be byte-identical to the
// entry we validated, or the run is not trustworthy.
const written = readFileSync(outFile, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
}
console.log(`wrote ${outFile} (${chars.length} chars, ${words.length} words)`);
