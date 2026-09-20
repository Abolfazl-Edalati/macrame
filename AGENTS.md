# AGENTS.md

Tool-agnostic agent instructions for this repository. This file is a pointer —
the canonical copy lives in [`CLAUDE.md`](./CLAUDE.md). Read that file; both are
kept in sync manually, so edit `CLAUDE.md` and re-mirror here.

## Agent skills

### Issue tracker

Issues live as GitHub issues in `Abolfazl-Edalati/macrame`, driven by the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles, each label string equal to its role name (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` at the repo root and `docs/adr/` next to it. See `docs/agents/domain.md`.
