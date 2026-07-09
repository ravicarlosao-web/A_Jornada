---
name: Jornada career sim MVP scope
description: What was deliberately cut from the full game spec for the v1 build, in case the user asks to extend it later.
---

The original spec (attached_assets) describes a much larger game with injuries, contracts, dressing-room/social-media systems, and detailed post-career content. The v1 build only implements: draft (attribute picks from legends), position selection, season simulation loop, press headlines, pressure/objectives, and final career tier scoring. Modo Completo only adds a simplified training-point-allocation step before each season versus Modo Rápido which auto-simulates.

**Why:** free-tier effort/scope constraints — building the full spec was not feasible in one pass.

**How to apply:** if the user asks for contracts, injuries, or social-media features later, treat them as net-new additions to `artifacts/jornada/src/engine/engine.ts` and `types.ts`, not bug fixes to existing behavior.

**Update:** Added injury system (chance-based, reduces games played, shown in season summary) and contract negotiation (renewal + rival club offers when contract expires) plus a persistent StatusBar header across in-career screens. Still missing from full spec: dressing-room dynamics, social media, detailed post-career content.

**Update 2:** Added dressing-room dynamics (relacaoElenco stat, harmony/conflict events based on temperamento/lideranca/carisma) and social media buzz (viral posts as manchetes with fonte "redes-sociais", affects fama). Still missing: detailed post-career content (hall of fame, historical stats).

**Update 3:** Added Hall da Fama (localStorage top-20 career leaderboard), a pós-carreira epilogue choice screen (técnico/comentarista/empresário/embaixador, unlocked conditionally) shown only in Modo Completo before the final results screen, and a "mentorar jovem da base" opt-in toggle in pré-temporada (Modo Completo, idade >= 24) that increments jovensMentorados + lideranca feeding the Legado score. Still simplified vs full spec: coach-relationship conversation events, roster competition/rotation decisions, contract negotiation levers, and the substitution-reaction system are not yet built.
