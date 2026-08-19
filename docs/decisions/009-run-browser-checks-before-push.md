# ADR-009: Run the real-browser checks before the push, not during the deployment

## Status

Accepted

## Date

2026-08-19

## Context

The Pages workflow ran `npm run check:deploy` between a push to `main` and the published
site. That gate is seven steps, and six of them are cheap: Markdown lint, the art library
validation, the unit and content contracts, the Eleventy build, HTML validation, and link
validation together take about eight seconds. The seventh, the Playwright suite, is
fourteen tests across four viewport projects, and its work is not cheap: roughly twenty
minutes of serial browser time, plus a `playwright install --with-deps chrome` on every run
because the workflow cached npm but not the browser.

On a four-core runner that suite had two workers and slower cores than a development
machine, so a deployment took upwards of forty minutes. Two tests made it worse by failing
on timeout rather than on a real defect, which spends the whole timeout budget: the bestiary
test walked all 57 profiles through a locator per assertion and waited for each lazily
loaded portrait to decode, and the accessibility test scanned eight routes sequentially
inside a single test, the 271KB bestiary page among them.

Nothing about that suite needs to run after the push. It tests the built site, which is
fully determined by the commit, so it answers the same question before the push as after —
only late, and on the slowest hardware involved, and while standing between a finished
change and its readers.

## Decision

Split the gate. `npm run check:ci` is the six fast steps and is what the Pages workflow
runs. `npm run check:deploy` is `check:ci` plus the browser suite, and `npm run check`
adds the formatting check on top; a versioned `pre-push` hook in `.githooks/` runs
`npm run check:deploy` and refuses a push that fails it. The hook runs `check:deploy`
rather than `check` so that it keeps the separation ADR-008 and commit bc1561c drew
between the gate and the archived legacy documents under `art/archive/`, which prettier
still reports and which nobody intends to reformat. `npm install` enables the hook by
pointing `core.hooksPath` at `.githooks`, so a fresh clone is covered without a separate
setup step.

Keeping the eight-second gate in the workflow is deliberate. The hook can be bypassed with
`git push --no-verify` and does not exist on a machine that has never run `npm install`,
so the deployment still refuses to publish content, build, HTML, or link failures. What it
no longer does is install Chrome or wait twenty minutes to learn something the developer
could have learned before pushing.

The two pathological tests are repaired rather than carried forward at their new location.
The bestiary test reads all 57 portraits in one `evaluateAll` and asserts in Node, then
proves decoding on a three-creature sample; every portrait file and its 320px variant is
already hashed on disk by `tests/unit/website-art-contract.test.mjs`, which is a stronger
check than a browser download and runs without one. The accessibility test becomes one
test per route so the eight scans run in parallel. Both jobs also gain `timeout-minutes`,
so a genuinely stuck run fails in ten minutes rather than at GitHub's six-hour default.

## Consequences

A deployment is a checkout, an `npm ci`, an eight-second gate, and an upload. Pushing costs
about two and a half minutes of local browser time that it previously did not, which is the
trade being made: the wait moves to where it is useful, next to the change and on fast
hardware, and off the path between `main` and the site.

## Alternatives considered

### Drop every check from the workflow

Simplest, and it matches the shape of the problem, but it makes a bypassed or uninstalled
hook sufficient to publish a broken site. The six fast steps cost eight seconds and remove
that failure mode, so there is no real saving in cutting them.

### Keep the full suite in CI but off the deploy path

A second, non-blocking workflow would keep browser coverage on the server. It still burns
twenty-plus runner minutes per push, and a non-blocking result is one nobody has to read;
a hook that refuses the push is a gate, not a notification.

### Shard the browser suite across runners

A matrix over the four viewport projects would cut wall clock roughly fourfold and keep
everything server-side. It leaves the Chrome install on every runner in the matrix, still
delays publication by several minutes, and does not address the two tests that were failing
on timeout. Worth revisiting only if the pre-push cost becomes the thing people complain
about.
