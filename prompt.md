# Claude Code build prompt — ServeNow Recovery Console

Read this file and `prd.md` completely, then implement the working application in this local project. Do the implementation, visual refinement, and verification; do not stop after writing a plan.

## Mission

Build a polished, interactive browser simulation for a consulting competition. It must explain ALL THREE ServeNow solutions as one connected recovery journey:

1. **Stabilize the Core** — application/database capacity, incident response, and recovery verification.
2. **Streamline the Flow** — selective asynchronous integration, safe job completion, and fresh, complete operational data.
3. **Restore Customer Trust — #ProofToRenew** — account prioritization, recovery covenant, evidence review, acceptance, renewal decisions, and recovery economics.

The central story is: customer needs define the evidence required; technical work produces that evidence; customers review it; contractual decisions remain separate. Solutions 1 and 2 can proceed in parallel. Solution 3 begins before the technical work.

The output is an application judges can operate, with a guided demo of about three minutes and a free exploration mode. The requested artifact is a demonstrator of the proposed workflow. It is not a production monitoring system or a benchmark of actual ServeNow performance.

## Read and inspect first

- Read `prd.md` as the authoritative product and simulation specification. It is self-contained; do not require the original PDFs or access to the earlier chat.
- Inspect the repository, its instructions, package manager, existing framework, and uncommitted changes before editing.
- Preserve unrelated files and work. If the folder only contains these handoff documents, scaffold the app alongside them.
- Use sensible defaults from the PRD. Ask a question only for a genuinely blocking ambiguity or permission, not routine layout or implementation choices.
- If a package or API has changed, consult its official documentation and choose mutually compatible versions. Do not copy obsolete setup commands blindly.

## Implementation approach

For a new local project use React, TypeScript, Vite, and Tailwind CSS, with an appropriate router. Use a small shared store, such as Zustand, or React Context plus a reducer. Use Lucide icons, SVG for topology and process diagrams, and a suitable chart library only where it improves clarity. Keep dependencies modest.

If this is already a healthy React/Next.js/TanStack project, adapt it rather than replacing it just to match the preferred stack. The application behavior and deployment readiness matter more than the framework.

Default to a frontend-only implementation:

- No paid APIs, external credentials, real customer data, or backend service are required.
- RabbitMQ, Celery, databases, CRM/ERP, failover, and customer acceptance are simulated domain components, not services to provision.
- Persist demo records in versioned localStorage with a memory-only fallback. This demonstrates persistence across browser reloads, not production durability or real authorization.
- Use one deterministic state machine and event log shared by all pages.
- Implement actual filtering, state transitions, validation, drawers, controls, export, reset, and navigation. A button must execute a meaningful action or explain why it is disabled.
- Use one application-level clock. Navigation must not start additional timers. Pause on tab hiding and restore paused after reload.
- Use predefined scenario events or a seeded generator, not unseeded random numbers that change on every render.

## First screen and visual direction

Create a refined, light enterprise console with a clear presentation hierarchy. The first viewport should communicate the entire recovery story at a glance.

- Product name: **ServeNow Recovery Console**.
- UI language: Bahasa Indonesia. Preserve the three solution names and familiar technical terms. Explain unfamiliar terms briefly in tooltips.
- Light warm background, white surfaces, navy typography, restrained burgundy primary actions.
- Assign consistent accents to the three solutions: blue for Core, teal for Flow, burgundy for Trust.
- Use generous whitespace, crisp typography, subtle borders, moderate corner radii, and readable charts.
- Avoid decorative stock photos, oversized marketing heroes, neon/glass effects, and a wall of identical KPI cards.
- Use code-rendered diagrams and charts. Do not use generated images for exact topology or data.
- Desktop is primary: verify 1440×900 and a 1280×720 presentation viewport. Also verify a narrow mobile viewport.

The main overview contains: five customer cards, a large clickable connected recovery map, a contextual next-action panel, a compact budget strip, and a recent-event timeline. Show a small persistent “Simulasi • Data contoh” indicator. Keep baseline case facts, targets, and scenario results visually distinct.

## Required pages

1. **Overview**: customer selector, scenario selector, global controls, shared status, end-to-end flow, next action, case baseline/target drawer, and budget summary.
2. **Stabilize the Core**: simulated system topology, diagnosis panel, incident owner, conditional runbook, current service state, verification outcomes, and recovery timeline.
3. **Streamline the Flow**: request composer, selective sync/async path, job table/detail, retry and reconciliation workflow, incremental data pipeline, checkpoint and freshness/completeness states.
4. **Restore Customer Trust**: the five #ProofToRenew components presented as working account tabs/sections: Account Recovery Router, Recovery Covenant, Customer Trust Console, Renewal Decision Room, and Recovery Economics Control.

Use a customer-scoped detail drawer across pages where useful. Keep core health global and evidence/account decisions customer-specific. Changing the selected customer must not reassign existing jobs, incidents, or evidence.

## Required scenarios

- **S1: Lonjakan tiket + CRM melambat** — default guided journey for TokoCepat. Include a recoverable failure and an ambiguous remote outcome.
- **S2: Komponen layanan gagal** — Bank FinNusantara. Show preparation, diagnosis, owner assignment, eligible recovery action, and verification. Technical recovery alone must not mark security/compliance complete.
- **S3: Pipeline data gagal** — TeleNusa. Show failed validation, checkpoint remaining unchanged, stale data, safe replay, successful publication, and evidence generation.
- LogistikGo and MedikaCare remain selectable, with their own concern, covenant, and evidence requirements; their status must not become successful just because another account's scenario passed.

Implement the main S1 journey end-to-end first, then complete S2/S3 and refine the visual experience. This is an implementation order, not permission to leave the remaining required features unfinished.

## Non-negotiable logic

- A request accepted is not a job completed. Show both states.
- Outbox recording precedes acceptance. Queue dispatch happens after acceptance.
- A timeout after possible remote commit requires verification, not blind resend.
- Retrying the same operation cannot increment its simulated business effect twice. Old versions cannot overwrite newer entity versions.
- Permanent failure does not endlessly retry. Exceeding retry bounds produces an actionable handling state.
- Core failure limits or pauses dependent workers. Adding workers must not magically solve an external quota or a failed database.
- Batch failure does not advance the published checkpoint or the complete-through timestamp.
- Refreshing the UI alone does not improve data freshness or completeness.
- Evidence must reference its account, run, criterion, covenant version, time window, and source events or fixture.
- Changing the covenant invalidates evidence evaluation against its previous version.
- Technical pass, evidence review, customer acceptance, intent to continue, and signed renewal are different states.
- Customer acceptance and renewal are explicit demo role actions. These roles are presentation perspectives, not real security controls.
- Budget is one shared ledger. Do not count an intervention repeatedly when a scenario replays.
- Refund obligations and optional goodwill are separate. Budget overrun blocks optional spending approval, not recognition of a mandatory obligation.
- ARR at risk is not automatically saved ARR, cash, profit, or ROI.
- Do not create fake production performance claims, security certification, data-residency verification, signed contracts, or a real hosting topology.

## Verification and completion

Test the state machine risks specified in the PRD and run production build/type checks. Test browser workflows if a browser test runner is available. Verify that direct route loads work with the deployment configuration.

Inspect actual screenshots of the running app at desktop, presentation, and mobile sizes. Fix clipped labels, diagram overlaps, unreadable charts, empty states, and low-contrast controls. If browser execution is unavailable, report that limitation precisely and still finish the build and automated logic checks you can run. Do not claim unexecuted checks passed.

Required deliverables in the project:

- Complete runnable source code and lockfile.
- `README.md` with local setup, scripts, architecture, simulation assumptions, and Vercel deployment instructions.
- `DEMO_SCRIPT.md` with the three-minute main demonstration and the two alternative scenarios.
- A small, meaningful test suite for engine invariants and key end-to-end flows.
- Vercel-compatible configuration when needed for the chosen framework. For a static Vite build, output is `dist`; ensure deep links resolve correctly.
- Exportable session/evidence JSON generated by the app, marked as simulated. Do not export a pretend signed contract.

Start the local dev server and provide its URL when your environment supports it. Prepare the application for deployment, but do not create accounts, connect third-party credentials, spend money, or publish it without the user's authorization.

Your final response should be in Indonesian and state: what was built, how to run it, checks actually executed, remaining limitations, and how the user can deploy it. Reference real file paths. Do not finish with only a plan or a claim that a static mockup is a working simulation.

