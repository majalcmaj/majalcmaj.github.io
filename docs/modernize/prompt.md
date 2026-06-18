# prompt.md — modernize phase runner

Invoke like: **`/plan execute phase1`** (or phase2 … phaseN). Run one phase, then stop.

## 1. Load context
Read in order:
- `CLAUDE.md` — this repo's hard constraints (language version, do-not-touch paths, deploy
  rules). Never violate them.
- This `prompt.md` (ceremony + guardrails) and the requested `phaseNN_*.md` (the spec).
- For a phase with jobs, also its `phaseNN-jobMM_*.md` files.

Phase → file map:
| id | title | file |
|---|---|---|
| phase01 | a11y-semantic-foundation | `docs/modernize/phase01_a11y-semantic-foundation.md` |
| phase02 | responsive-layout | `docs/modernize/phase02_responsive-layout.md` |
| phase03 | seo-essentials | `docs/modernize/phase03_seo-essentials.md` |
| phase04 | visual-refresh (3 competing variants) | `docs/modernize/phase04_visual-refresh.md` |
| phase04-job01 | clinical-calm | `docs/modernize/phase04-job01_clinical-calm.md` |
| phase04-job02 | fresh-mint | `docs/modernize/phase04-job02_fresh-mint.md` |
| phase04-job03 | warm-sand | `docs/modernize/phase04-job03_warm-sand.md` |

> **Phase 04 is special:** its 3 jobs are *competing* full redesigns of the same files, NOT
> file-disjoint slices. Do **not** merge them together — set up the shared gate on the phase branch,
> spawn the 3 design jobs in separate worktrees, then the **user picks one**; only that branch
> merges. See the phase file's deviation note.

## 2. The ceremony — red → green → refactor (every phase, no waste)
- **Red**: write the check / assertion / assumption first and *run it* to prove it is NOT yet
  met. A phase with nothing red to show has nothing to do.
- **Green**: the smallest change that satisfies the check; validate it now passes.
- **Refactor**: reshape to the leanest, clearest form. Delete every bit of waste — dead code,
  duplication, needless abstraction. Code and docs end simpler than they started.

## 3. Parallel jobs (worktree-isolated)
If the phase file lists jobs, the jobs are file-disjoint and run concurrently:
- Spawn one subagent per job, each in its **own git worktree** (`isolation: "worktree"`).
- Each job runs its own red → green → refactor on its slice, commits inside its worktree, and
  flips its own job marker to DONE (`scaffold.sh done <slug> phaseNN-jobMM <sha>`).
- The main thread then merges the job worktree branches, **squashing to one phase commit**.

## 4. Verify
- Run this repo's check (see `CLAUDE.md` / Makefile — e.g. `make test-local`). It must stay
  green with the same pass/skip count. Never commit a red phase; fix forward.
- Run any phase-specific verification listed in the phase file.

## 5. Commit & mark done
- Work on the current branch unless it is the default branch; if so, branch first.
- One commit per phase, using the phase file's Commit line, ending with this repo's
  `Co-Authored-By` trailer (copy it from `CLAUDE.md` or an existing commit).
- Do NOT push or deploy unless asked.
- Flip the phase marker: `scaffold.sh done <slug> phaseNN <commit-sha>`.

## 6. Guardrails
- Respect every constraint in `CLAUDE.md` (do-not-touch paths, language version, staging path).
- Stop after the single requested phase. Report: what changed, verify results, and the
  next `/plan execute …` step.
