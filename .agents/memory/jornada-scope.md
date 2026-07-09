---
name: Jornada career sim MVP scope
description: What was deliberately cut from the full game spec for the v1 build, in case the user asks to extend it later.
---

The original spec (attached_assets) describes a much larger game with injuries, contracts, dressing-room/social-media systems, and detailed post-career content. The v1 build only implements: draft (attribute picks from legends), position selection, season simulation loop, press headlines, pressure/objectives, and final career tier scoring. Modo Completo only adds a simplified training-point-allocation step before each season versus Modo Rápido which auto-simulates.

**Why:** free-tier effort/scope constraints — building the full spec was not feasible in one pass.

**How to apply:** if the user asks for contracts, injuries, or social-media features later, treat them as net-new additions to `artifacts/jornada/src/engine/engine.ts` and `types.ts`, not bug fixes to existing behavior.
