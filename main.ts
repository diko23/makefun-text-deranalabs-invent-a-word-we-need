import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS = 140;

const ENTRY_LINE: string =
  "afterbye (n.): the awkward stretch of heading the same way right after two people say goodbye";

function validateEntry(text: string): void {
  const charCount: number = [...text].length;
  if (text.trim().length === 0 || charCount > MAX_ENTRY_CHARS) {
    throw new Error(`Invalid entry length: ${charCount}`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("Entry must be a single line");
  }
}

function resolveOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  return configured !== undefined && configured.trim().length > 0
    ? configured.trim()
    : "/output";
}

function writeEntry(): void {
  validateEntry(ENTRY_LINE);
  const outputDir: string = resolveOutputDir();
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  writeEntry();
} catch (err: unknown) {
  const message: string = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exit(1);
}
