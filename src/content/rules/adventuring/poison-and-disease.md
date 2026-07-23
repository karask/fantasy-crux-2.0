---
type: rule
id: adventuring-poison-disease
chapter: adventuring
title: Poison and Disease
slug: poison-and-disease
order: 80
summary: 'Poison allows one delayed Resilience-versus-Potency test; disease repeats that test after each Delay until the victim wins.'
aliases:
  - potency
  - venom
  - infection
quickReference:
  group: adventuring
  order: 80
---

Poisons and diseases list a **Type**, **Delay**, **Potency** from 10 to 100, **Effect**, and—where needed—**Duration**. Roll Potency like a skill in an opposed test against the victim's Resilience.

## Poison {#adventuring-poison}

After the Delay, make one opposed Resilience-versus-Potency test:

- If the victim wins, the poison has no effect.
- If the poison wins, apply its full Effect for its Duration.

A successful Healing test completed before the resistance test grants the victim `+1B` to that test. Poison still allows only one resistance test.

**Gorgon Serpent Venom:** Ingested or smeared; Delay `1D3` rounds; Potency 34; Effect `1D3` HP damage and -3 CON; Duration `6D10` minutes.

## Disease {#adventuring-disease}

After exposure and the first Delay, make an opposed Resilience-versus-Potency test:

- If the victim wins, the disease ends or fails to take hold.
- If the disease wins, apply its Effect, wait another Delay, and test again.
- Continue until the victim wins.

A successful Healing test grants `+1B` to the patient's next resistance test.
Ongoing effects remain, and damage from the disease cannot heal, while the disease
is active. Normal recovery begins after the victim wins.

[Magical curing](/rules/magic/#effects--magic-healing) opposes Shaping with Potency and requires Intensity based on that Potency.

**The Shakes:** Spread by touch; Delay `1D2` days; Potency 50; Effect halves DEX and deals `1D6` damage each day while active.
