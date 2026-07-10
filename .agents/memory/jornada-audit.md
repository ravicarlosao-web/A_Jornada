---
name: Jornada audit progress
description: Status of the prioritized post-import review fixes for the Jornada career-sim app.
---

Original 6-item audit (TreinoScreen, DraftScreen, Headlines, ConversaTecnico, ResultadoFinal, Narrativa) — all complete.

Follow-up prioritized feature set — all 4 complete and code-reviewed:
1. Live match feed during season sim (per-match highlight events, "partida-ao-vivo" phase).
2. Narrative/headline templates migrated from hardcoded arrays to a static JSON data file.
3. Money-sink economy: salary/sponsorship income accrual, store with one-time and repeatable lifestyle items.
4. Anytime transfer requests: player can voluntarily open a coach conversation from pre-season and request a transfer mid-contract, triggering real negotiations with a signing bonus tied to the old contract's buyout clause.

**Why this file matters:** feature 4 initially had an exploit — requesting a transfer, accepting an offer, and immediately repeating let the player farm unlimited signing bonuses without ever advancing a season. Fixed by gating voluntary transfer requests to once per season via a state flag reset on season advance.
**How to apply:** if extending the transfer/negotiation flow again, keep any "free" player-initiated action that grants money or contract terms gated by a per-season flag, not just by game phase — phase transitions alone don't stop rapid repetition when no season-clock advances.
