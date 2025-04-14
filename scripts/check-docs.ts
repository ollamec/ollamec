import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TYPEDOC_JSON = resolve('docs/typedoc.json');

// Get .ts files from CLI args (e.g. passed by Lefthook)
const files = process.argv
  .slice(2)
  .filter((f) => f.endsWith('.ts') && !f.includes('node_modules'));

// Exit early if no relevant files
if (files.length === 0) {
  console.log('No TypeScript files to check.');
  process.exit(0);
}

interface SourceReference {
  fileName?: string;
}

interface CommentBlock {
  shortText?: string;
  summary?: unknown[];
}

interface TypeDocNode {
  name: string;
  kindString: string;
  flags?: {
    isExported?: boolean;
  };
  comment?: CommentBlock;
  sources?: SourceReference[];
  children?: TypeDocNode[];
}

interface MissingDoc {
  name: string;
  kind: string;
  file?: string;
}

// Step 1: Run TypeDoc on just the changed files
try {
  console.log('Checking documentation for:', ...files);
  execSync(
    `bunx typedoc --json ${TYPEDOC_JSON} --entryPoints ${files.join(' ')}`,
    {
      stdio: 'inherit',
    }
  );
} catch {
  console.error('❌ Failed to run TypeDoc.');
  process.exit(1);
}

// Step 2: Parse output
if (!existsSync(TYPEDOC_JSON)) {
  console.error('❌ TypeDoc output not found.');
  process.exit(1);
}

const root: TypeDocNode = JSON.parse(readFileSync(TYPEDOC_JSON, 'utf-8'));
const missingDocs: MissingDoc[] = [];

function checkNode(node: TypeDocNode): void {
  if (node.flags?.isExported && node.name && node.kindString) {
    const hasComment =
      Boolean(node.comment?.shortText) ||
      Boolean(node.comment?.summary?.length);

    if (!hasComment) {
      const file = node.sources?.[0]?.fileName;
      missingDocs.push({ name: node.name, kind: node.kindString, file });
    }
  }

  if (node.children) {
    for (const child of node.children) {
      checkNode(child);
    }
  }
}

checkNode(root);

// Step 3: Report
if (missingDocs.length > 0) {
  console.error('\n❌ Missing documentation for exported symbols:\n');
  for (const doc of missingDocs) {
    const location = doc.file ? ` (in ${doc.file})` : '';
    console.error(`- [${doc.kind}] ${doc.name}${location}`);
  }
  console.error('\n🔒 Please add TSDoc comments before committing.');
  process.exit(1);
}

console.log('✅ All changed files are properly documented.');
