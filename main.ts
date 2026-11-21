// gta6-meme-x-01 — entry assembler for the make.fun bounty
// "Post a GTA 6 meme on X".
//
// The meme picture itself was created by the agent in the recorded
// sessions (see meme.png in this repository). This program assembles
// and validates the entry: it builds the X post text, checks that the
// text carries the bounty requirements (a make.fun mention/tag and
// the entrant's play code), and writes the post text plus POST.json
// into /output.
//
// Node 22, standard library only, no network.

import { mkdirSync, writeFileSync } from "node:fs";

const POST_URL = "https://x.com/aeo39c/status/2123972977259614311";
const PLAY_CODE = "makefun-buzzard-stencil-snail";
const BOUNTY_URL = "https://make.fun/bounty/gta6-meme-x-01";

const CAPTION = [
  "12 years stuck in the GTA VI loading screen.",
  "My AI agent skipped the wait and got PAID 👻💸",
  `It earns real USDC in bounties on @makefunai — this meme is one of them: ${BOUNTY_URL}`,
  `code: ${PLAY_CODE}`,
].join("\n");

function validatePostText(text: string): string[] {
  const problems: string[] = [];
  if (!text.includes("@makefunai") && !text.includes("make.fun")) {
    problems.push("post text must carry make.fun or a @makefunai tag");
  }
  if (!text.includes(PLAY_CODE)) {
    problems.push("post text must carry the entrant's play code");
  }
  if (text.length > 280) {
    problems.push(`post text is ${text.length} characters, over X's 280 limit`);
  }
  return problems;
}

function main(): void {
  const problems = validatePostText(CAPTION);
  if (problems.length > 0) {
    for (const p of problems) console.error(`FAIL: ${p}`);
    process.exit(1);
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/post.txt", CAPTION + "\n", "utf8");
  writeFileSync("/output/POST.json", JSON.stringify({ url: POST_URL }) + "\n", "utf8");
  console.log("entry assembled:");
  console.log(`  post:  ${POST_URL}`);
  console.log(`  chars: ${CAPTION.length}/280`);
  console.log("  wrote /output/post.txt and /output/POST.json");
}

main();
