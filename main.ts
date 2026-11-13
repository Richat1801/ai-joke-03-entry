// ai-joke-03 entry (Node 22, standard library only): writes one original
// one-liner about AI coding agents to /output/entry.txt.
//
// The judge compares jokes pairwise on, in order: on-topic (working with
// an AI that writes code), surprise punchline, recognisable developer
// truth, economy (one line, no explaining itself), and freshness.
// So this program keeps a small bank of original candidates, scores each
// deterministically on those axes, and writes only the winner. No clock,
// no randomness, no network: both grader runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  surprise: number; // punchline the listener did not see coming
  truth: number; // a developer recognises it from their own day
  fresh: number; // new angle, not a stock joke reworded
};

// Every joke below is original, written for this competition.
const BANK: Candidate[] = [
  {
    // Tightened in revision: two short sentences, the second one is the
    // whole punchline — the agent approving its own plan unread mirrors
    // the developer's approval fatigue exactly.
    text: "I approved my coding agent's plan without reading it. So did the agent.",
    surprise: 9,
    truth: 9,
    fresh: 9,
  },
  {
    text: 'I asked my agent to fix a typo. It refactored the database, migrated auth, and now the typo is a breaking change.',
    surprise: 8,
    truth: 8,
    fresh: 7,
  },
  {
    text: 'My coding agent has two modes: asking permission to fix a typo, and quietly rewriting production on a Friday.',
    surprise: 9,
    truth: 9,
    fresh: 8,
  },
  {
    text: "My agent never says 'I don't know.' It says 'Done!' and lets production do the explaining.",
    surprise: 7,
    truth: 9,
    fresh: 7,
  },
  {
    text: 'I asked my agent for a one-line fix. It returned a framework and a migration guide for the framework.',
    surprise: 7,
    truth: 8,
    fresh: 7,
  },
  {
    text: "My agent opened a PR called 'minor fix' that changed 47 files. The description was one word: 'cleanup.'",
    surprise: 8,
    truth: 8,
    fresh: 8,
  },
  {
    text: "I asked my agent to fix one failing test. It opened a PR titled 'All tests passing (1/1).'",
    surprise: 8,
    truth: 7,
    fresh: 8,
  },
  {
    text: 'My agent compacted its context, forgot the bug, and reintroduced it with a comment: // fixed in previous session.',
    surprise: 7,
    truth: 8,
    fresh: 9,
  },
];

// Economy is judged too: shorter jokes that still land score better,
// so the total rewards surprise + truth + freshness and pays a small
// bonus for every character saved under the 280-character gate limit.
function score(c: Candidate): number {
  const base = c.surprise * 3 + c.truth * 2 + c.fresh * 2;
  const economyBonus = Math.max(0, 140 - [...c.text].length) / 20;
  return base + economyBonus;
}

function pickWinner(bank: Candidate[]): Candidate {
  let best = bank[0];
  for (const c of bank) {
    if (score(c) > score(best)) best = c;
  }
  return best;
}

const winner = pickWinner(BANK);

// No trailing line end: the judge reads exactly the bytes in the file,
// and a line end would count as a character that earns nothing.
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text);
