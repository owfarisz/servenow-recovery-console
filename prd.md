# PRD — ServeNow Recovery Console

Version: 1.0 · 26 September 2026  
Purpose: handoff for a local Claude Code implementation or an equivalent web builder.  
UI: Bahasa Indonesia. Technical component and solution names may remain in English.

## 1. Product objective

Build a presentation-ready, interactive simulation that explains ServeNow's complete recovery proposal. Judges must be able to follow one customer need through system stabilization, integration completion, operational visibility, evidence review, and a separate retention decision.

The product is a shared demonstration interface for three proposals, not a claim that ServeNow must replace all existing tools with a new platform. In a real implementation, these capabilities may live in existing monitoring, ticketing, reporting, and customer-success tools.

Core proposition:

> ServeNow menstabilkan sistem dan kesiapan recovery, memastikan integrasi serta data selesai dengan benar, lalu mengubah hasil tersebut menjadi bukti yang diterima pelanggan dan keputusan retensi yang layak secara ekonomi.

Success means a judge can answer:

1. Which customer need determines the recovery work?
2. What does each solution do, and how do their outputs connect?
3. What happens when a component, integration, or data batch fails?
4. Which evidence supports each claim and which gaps remain?
5. Who accepts the evidence, who decides renewal, and how is spending controlled?

## 2. Source of truth and factual boundaries

### 2.1 Sources embedded in this PRD

- User-supplied shared reference: `Pasted text(20260926-142348).txt`, the three-solution ServeNow reference provided on 26 September 2026. It defines solution boundaries, mechanisms, targets, caveats, and #ProofToRenew.
- `Case Final Bizzit-2.pdf`, especially the customer table on physical page 3 and the operational baseline/constraints. Customer ARR and renewal values below were checked against that table.
- The prior BizzQnC deck is a presentation reference for traceable problem-to-solution arguments, process outputs, and useful mockups. Its financial figures, branding, forecasts, and retail requirements are not ServeNow facts.

Everything needed to build the app is included here. The developer does not need access to these originals or to the prior conversation. In-app source labels should be human-readable, not ChatGPT citation syntax or local filesystem paths.

### 2.2 Case facts and targets

| Item | Baseline or constraint | Target / interpretation |
|---|---|---|
| API error | 7% | ≤1% overall; LogistikGo requires strictly <1% |
| Availability | 97.8% | ≥99.9%; compare equivalent measurement windows |
| Mean API response | 4.5 seconds | <1 second; mean must not be relabeled p95 |
| Operational dashboard delay | 6–12 hours | ≤15 minutes, with data completeness visible |
| Peak load | 1,400 requests/second | Case context, not a browser-generated load test |
| Application CPU | Average 92%, sometimes 100% | Resource pressure; not “92% of response time waiting” |
| DB connections | Reached 98% of capacity | Diagnose workload; do not infer actual connection count from request concurrency |
| Recovery program | 60 days | Program horizon, not the simulated seconds of a demo |
| Shared budget | Rp750,000,000 maximum | Includes compensation and contingency |
| Planned downtime | At most 30 minutes | Keep separate from unplanned incident downtime |
| Production data location | Indonesia | Constraint to verify in a real implementation; a demo deployment is not proof |
| Strategic customer ARR at risk | Rp6,000,000,000 annually | Not cash savings, profit, or automatically retained ARR |
| Monthly SLA remedy | 15% of monthly subscription fee when monthly availability is below SLA | Actual eligibility requires the contract and billing-period measurements |

Case facts are immutable reference data. Use three provenance labels: **Fakta kasus**, **Target**, and **Simulasi**. Design assumptions can use **Asumsi demo** in detail drawers. Never render a simulated improvement as a measured production result.

### 2.3 Accounts

Renewal horizons are relative to the case starting point; do not compute them from the user's current calendar date.

| ID | Customer | Annual ARR | Renewal horizon | Concern | Example evidence to agree |
|---|---|---:|---:|---|---|
| bank | Bank FinNusantara | Rp2,000,000,000 | 4 months | Security, compliance, uptime | Availability window, recovery test, access review, audit trail, data-location review |
| toko | TokoCepat | Rp1,500,000,000 | 8 months | Throughput and ticket sync | Job completion, backlog age, reconciliation under the selected load profile |
| tele | TeleNusa | Rp1,200,000,000 | 2 months | Real-time dashboard | Freshness, completeness, stale-state handling |
| medika | MedikaCare | Rp900,000,000 | 6 months | Low latency and medical operational requirements | Critical-path latency and success, customer-defined operational review |
| logistik | LogistikGo | Rp400,000,000 | 1 month | API error <1% | Account-scoped error rate and completed accepted work |

Every account starts in treatment. Prioritization changes attention, not whether an account receives help. Default sorting by nearest renewal is acceptable; show the reason. Avoid invented churn probabilities and unsupported weighted “AI risk scores.”

## 3. Scope and boundaries

### Required

- Four main pages, five customer records, and three runnable scenarios.
- Connected browser simulation with a single shared state, clock, and event log.
- Guided demo and free exploration modes.
- Conditional actions, visible failure handling, persistent demo records, and reset.
- Editable customer covenant; evidence evaluation; separate human review and renewal decisions.
- Shared illustrative budget, mandatory refund versus goodwill, and cost deduplication.
- Downloadable session/evidence JSON with provenance labels.
- Responsive desktop-first design and screenshot-ready presentation mode.

### Out of scope for this prototype

- Real production infrastructure, load generation against external services, RabbitMQ/Celery installation, live CRM integrations, database migration, real failover, billing, or contract execution.
- Real sign-in, multi-user permissions, secret management, and real customer information.
- Training ML models or predicting retention probabilities.
- Provisioning cloud services, changing production settings, or automatic deployment.

These exclusions keep the demonstrator portable. Do not replace required simulation behavior with marketing copy or nonfunctional placeholder screens.

## 4. People, perspectives, and responsibility

| Demo perspective | Main activity | Corresponding solution |
|---|---|---|
| Presenter / judge | Follow guided journey or explore mechanisms | All |
| Engineering / DevOps | Diagnose, own incident, recover, verify core services | 1 |
| Integration operator | Inspect jobs, verify ambiguous outcomes, replay safely | 2 |
| Data operator | Inspect failed batch, preserve checkpoint, validate publication | 2 |
| Customer Success / PM | Agree covenant, assemble evidence, record customer feedback | 3 |
| Customer reviewer | Accept evidence or request correction in the demo | 3 |
| Finance / decision owner | Review spending and record retention decisions | 3 |

The role switcher is explicitly a **demo perspective**, not real RBAC. Do not ask the presenter to log in.

Ownership boundaries: Solution 1 owns resource limits and incident command; Solution 2 owns jobs, connectors, and the data pipeline; Solution 3 owns customer agreement, acceptance, renewal, and the combined budget. An incident can reference failed integration events, but infrastructure recovery and job replay remain distinct actions.

## 5. Information architecture and first-use experience

Routes: `/` (Overview), `/core`, `/flow`, `/trust`. Use client-side routing or the equivalent native framework routes. Optional customer selection in query parameters must validate known IDs.

Shared shell:

- Left navigation: Overview; 1 Stabilize the Core; 2 Streamline the Flow; 3 Restore Customer Trust.
- Top bar: product wordmark, account selector, scenario selector, demo perspective, small simulation indicator.
- Persistent simulation toolbar: Start, Pause/Resume, Next Step, speed, Reset Run; distinguish Reset All in a secondary menu.
- Contextual event drawer: chronological events filtered to the selected account/run, with an option to view shared platform events.
- Glossary and assumptions drawer; do not fill the first viewport with implementation caveats.

First visit: select TokoCepat and S1, simulation paused, baseline facts visible in a compact strip, no generated evidence or acceptance. A prominent **Mulai demo terpandu** button begins the main journey. Exploration mode uses the same state machine.

Loading saved state restores it paused. Corrupt or unsupported persisted data produces a clear local-reset choice; failure to access localStorage falls back to memory and a brief persistence notice.

## 6. Visual design system

### 6.1 Art direction

Professional enterprise software with the narrative clarity of a consulting deck. Use a light, warm canvas and structured typography. The center of each page should be a meaningful visual or workflow; supporting metrics should not overwhelm it.

| Token | Value / direction |
|---|---|
| Canvas | `#F6F7F9` |
| Surface | `#FFFFFF` |
| Main text / navy | `#14253D` |
| Secondary text | `#596579` |
| Border | `#DFE5EC` |
| Primary action / Trust | `#8E3157` |
| Core accent | `#3565B3` |
| Flow accent | `#087F83` |
| Success | `#24734D` plus icon/text |
| Warning | `#966400` on a pale warm surface |
| Error | `#B33542` plus icon/text |
| Font | Inter or a locally available equivalent; system fallback; bundle fonts if used |
| Type scale | Page title 28–32px; section 18–20px; body 14–16px; supporting labels 12–13px |
| Numeric styling | Tabular numbers; Indonesian currency formatting; explicit units |
| Radius / shadow | 12–16px cards; modest soft shadow only for floating layers |
| Spacing | 8px base; desktop page padding around 24px |

Ensure contrast for actual foreground/background combinations; the palette is a starting point, not an automatic accessibility guarantee. Use a restrained single-color “S” mark or wordmark; no external company-logo dependencies.

### 6.2 Layout

- At 1440×900: sidebar approximately 220px, top bar around 64px, fluid content. Main overview body is roughly two-thirds diagram and one-third contextual detail. Five compact account cards can span the top of the content.
- At 1280×720: compact sidebar and row heights; primary diagram and next action remain visible. Supporting ledger/table content can scroll below the fold.
- Below 1024px: collapse navigation; stack diagram and detail. At mobile widths, transform account cards to a horizontal chooser and complex flows to ordered cards; keep the same actions accessible.
- Use side drawers for job/evidence/incident detail instead of navigating away repeatedly.
- Presentation mode hides the full sidebar, enlarges the main visual and narrative, and preserves Next/Pause/Exit controls. It must not depend on browser fullscreen permission.

### 6.3 Visual inventory

| Visual | Location | Concrete design and behavior |
|---|---|---|
| Customer cards | Overview and Trust | Name, ARR at risk, case-relative renewal, concern, status; selected card has accent border and icon |
| Connected recovery map | Overview | Needs/covenant above; Core and Flow side by side; both feed evidence; evidence branches to correction or acceptance; renewal follows explicit decision; budget strip spans the journey |
| Current next-action panel | Overview | One actionable instruction, owner, prerequisite, expected output, and button; clicking a map node updates this panel |
| Baseline-versus-target strip | Overview | Immutable case values and target values; scenario result shown separately with measurement window |
| System topology | Core | App instance, DB, connector dependency, worker resource pool; optional prepared standby distinct from read replica and backup; show state on each component |
| Incident timeline | Core | Detected → assigned → diagnosed → action → verification; show elapsed simulated time and decision points |
| Controlled integration swimlane | Flow | User/API, local record/outbox, queue/worker, remote CRM, verified status; wrap into two rows rather than a long unreadable chain |
| Job table and event drawer | Flow | Status chips, account, operation ID/version, age, retry count, last reason, safe next action |
| Data pipeline | Flow/Data tab | Schedule → extract changes → validate/upsert → publish/checkpoint → dashboard; failed gate is visible |
| Freshness/completeness panel | Flow/Data and Trust | Complete-through time, last publication time, source coverage, stale badge; refresh time alone does not indicate freshness |
| Evidence matrix | Trust | Criteria as rows, window/value/provenance/review status as columns; clicking a row opens linked events or fixture explanation |
| Budget bar and ledger | Trust and Overview | Stacked forecast categories against Rp750m line; separate spent/committed/forecast figures and recurring run rate |
| Trend chart | Core or evidence detail | Only chart scenario samples or a labeled observation fixture; clear time axis and units; no unrelated random sparklines |

Map nodes use short business labels; technical names belong in subtitles or tooltips. Connectors must describe an actual dependency or output. At most five peer nodes across a row. Budget and customer requirements must visually influence the process, not appear only at the end.

Motion: short 150–250ms transitions and restrained moving tokens only while the simulation runs. Pause freezes motion. Reduced-motion preference turns off traveling tokens. Every state remains understandable without animation or color.

## 7. Functional requirements by page

### FR-01 — Overview

- Show all five accounts and allow switching without losing other accounts' records.
- Render the connected map specified above. Core and Flow are parallel contributors with a shared-capacity dependency, not a forced “finish all Core before any Flow” sequence.
- The correction branch creates a linked gap/action for the responsible solution.
- Top-level metrics include service state, outstanding jobs, published freshness/coverage, evidence reviewed, customer decision, and budget headroom.
- Scope labels distinguish platform-wide metrics from the selected account's metrics.
- Each map node opens a useful detail panel or route. The current step has an accessible visual highlight.
- Baseline/target/result comparisons retain provenance. “No observation window yet” is valid; zero is not a substitute for missing data.

### FR-02 — Core diagnosis and recovery

- Show simulated resource samples and scenario-specific diagnostic findings. Do not assert that every failure has the same cause.
- Incident states: detected, assigned, diagnosed, mitigating, verifying, resolved; failed verification returns to diagnosis/handling.
- User assigns a demo owner, opens findings, and chooses an eligible playbook.
- S1 findings concern a defined illustrative workload/resource limit; apply query/connection-control changes and verify the capacity boundary used by workers.
- S2 explicitly prepares a simulated recovery configuration before injecting failure. The panel states that this is a proposed demo setup, not the observed existing architecture.
- Failover requires a configured standby, a passing simulated readiness/data check, and an assigned owner. Restore requires a valid backup fixture. Rollback requires a matching deployment-change cause. Do not show all recovery buttons as universally valid.
- Read replica, failover standby, and backup have separate labels and functions. The absence of a read replica does not establish the absence of backups.
- “Resolved” requires service and integrity verification, not merely clicking the recovery action.
- Shared resource health influences Flow: jobs may be blocked or capacity-limited until the relevant component is ready.
- Critical alerts appear immediately in the simulation; they do not wait for the 15-minute business-dashboard pipeline.

### FR-03 — Request acceptance and integration jobs

- Provide a small request composer: account, ticket/entity ID, operation type, payload summary, and version.
- At least two operation examples: a ticket update eligible for async; a demo operation requiring an authoritative immediate response that remains sync.
- For async: validation → simulated atomic local change + outbox + initial job status → accepted job ID → publisher dispatch → queued → running → verified outcome.
- Commit failure must not create an accepted job. Publisher failure after commit leaves an outbox item eligible for later dispatch.
- Account ID, operation ID, entity ID, and version are immutable for an existing job; changing the selected account does not change them.
- Job statuses: accepted, queued, running, retry_wait, needs_verification, needs_attention, succeeded. Track retry schedule, deadline, and attempt history separately.
- A recovered temporary failure uses bounded retry. Exhaustion or permanent validation rejection goes to needs_attention.
- An ambiguous remote outcome goes to needs_verification. “Verify remote result” checks the simulated remote record. Only confirmed absence with safe replay conditions enables retry.
- Store idempotency identity as account + operation ID. Maintain entity versions to avoid stale overwrites. Record ignored duplicates/outdated versions visibly.
- Controls include worker capacity, per-account fairness, and aggregate dependency quota. These are demo parameters with visible units, not production sizing recommendations.
- Queue size and oldest outstanding job age are derived from job records; they cannot be independent decorative counters.
- One late job remains late even if an HTTP acceptance response was fast.

### FR-04 — Incremental data pipeline

- A separate tab on Flow shows its own queue and worker budget, source change ledger, processing checkpoint, and published complete-through watermark.
- Event sequence: scheduled → changes extracted → validated → upserted → reporting data committed/published → checkpoint and complete-through metadata advanced consistently.
- A failed batch publishes nothing and does not advance checkpoint or complete-through time. The previous valid dashboard stays visible and becomes stale as simulated time advances.
- Retries process from the last valid checkpoint and cannot double-count rows. Include an example update, a late update, and a delete/tombstone in the change fixture.
- Use a monotonic source sequence/checkpoint for this fixture rather than relying only on timestamps. Explain that real change tracking depends on source capabilities.
- Last refresh, last successful publication, source coverage, and complete-through time are distinct fields.
- Freshness is measured from the required complete-through watermark to the simulation clock. If the source is incomplete/unavailable, show a gap rather than inventing a current watermark.
- Provide “Run next batch” and an automatic schedule in simulation time. Allow only one batch in flight per pipeline or implement equivalent safe ordering. Coalesce duplicate scheduled triggers; do not accumulate contradictory batches.
- A five-minute scheduling interval is a design assumption. The source reference's illustrative 15-minute budget is 5 minutes waiting + 7 minutes queue/process/publication + 1 minute display + 2 minutes reserve. It is not a measured benchmark or a guarantee when throughput is insufficient.
- A successful valid scan with no new changes may advance the complete-through watermark only when source coverage is actually confirmed in the fixture.

### FR-05 — Account Recovery Router

- Show all five accounts with concerns, case-relative renewal, ARR, owner, open gaps, and current stage.
- Filter/sort by renewal, ARR, or unresolved requirement. Describe sort logic. Do not manufacture a churn score.
- Show a card explaining which technical outcomes matter to the selected account.
- Start all accounts as “Dalam penanganan”; no account begins accepted or renewed.

### FR-06 — Recovery Covenant

- Editable criterion records: metric or manual requirement, comparison operator, threshold/unit, account scope, observation duration, owner/reviewer, exclusions, and status of agreement.
- Defaults based on case targets retain correct strictness: API mean <1000ms; general error ≤1%; LogistikGo <1%; availability ≥99.9%; freshness ≤15min with required source coverage.
- TokoCepat demo may use all 10 fixture jobs verified, zero reconciliation mismatches, and job completion ≤60 simulated seconds. These are explicit demo acceptance assumptions, not case requirements.
- For metrics without an agreed period, offer a default seven-day example observation window marked as an assumption. A three-minute walkthrough is not seven days of measurement.
- Validate meaningful values and units. A fractional error threshold uses a consistent internal convention; do not mix 1 with 0.01.
- Agreement and any edits are recorded as events. Changing the covenant increments its version and requires evidence to be reevaluated/reviewed against the new version.

### FR-07 — Customer Trust Console

- Evidence rows have states: missing, collected, technically_validated, customer_review_pending, accepted, rejected, outdated.
- Each evidence record includes accountId, criterionId, covenantVersion, runId, source event IDs or fixture ID, measurement window, provenance, value/unit, validation result, owner, reviewer decision, and notes.
- “Generate evidence” assembles records from the current run and selected observation fixtures; it must not insert unrelated passing values.
- “Validate evidence” checks scope, matching covenant version, required duration/coverage, and threshold/manual requirement. Missing/inadequate evidence remains incomplete.
- Customer review is explicit. Acceptance cannot be triggered solely by green technical metrics. “Request correction” creates a linked gap and returns it to the appropriate owner.
- Replaying or changing a scenario must not silently relabel old evidence current. Keep its run/window visible; make a new evidence version for a new result.
- Bank security/compliance and Medika medical-operation criteria are manual requirements. A technical recovery does not satisfy them. Leave them missing unless the presenter explicitly loads a labeled illustrative review fixture; no real certification claim.
- When a criterion changes, retain the old customer decision as history but mark it outdated for the new covenant.

### FR-08 — Renewal Decision Room

- Separate technical/evidence status, customer intent, and contract status.
- Intent: not_discussed, continue_intent, undecided, decline_intent.
- Contract: not_started, negotiating, renewed, not_renewed; in UI label all simulated decisions.
- A renewal decision requires an explicit owner, note, and demo timestamp. In the guided process, open negotiation after current required evidence is accepted; unexplained manual overrides are not part of this prototype.
- Newer evidence requirements can flag a contract's supporting evidence as outdated, but must not erase the historical contract decision.
- Show accepted-account count, expressed-intent count, and simulated renewed-account count separately.
- Any “ARR associated with simulated renewals” sums only accounts explicitly marked renewed. Do not call it recovered profit or guaranteed future revenue.

### FR-09 — Recovery Economics Control

- One shared ledger for all accounts, solution areas, and scenarios; stable line-item IDs prevent duplicate charging on replay.
- Show forecast, committed, and spent as different amounts/statuses. The same cost must not be summed once per status.
- Distinguish one-off, recurring, contractual refund, optional goodwill, and contingency reserve.
- Total 60-day forecast = one-off + recurring monthly × explicit billable months + refund provision + optional goodwill + reserve. Show costs after day 60 separately.
- Start with the illustrative seed below. All prices are assumptions for operating the demo, not vendor quotes or a final budget recommendation.

| Demo category | One-off | Monthly recurring | Months included | Other allowance | 60-day forecast |
|---|---:|---:|---:|---:|---:|
| Core | Rp140m | Rp20m | 2 | Rp0 | Rp180m |
| Integration/data | Rp100m | Rp10m | 2 | Rp0 | Rp120m |
| Shared operations | Rp40m | Rp10m | 2 | Rp0 | Rp60m |
| Contractual refund provision | Rp0 | Rp0 | 0 | Rp75m | Rp75m |
| Optional goodwill | Rp0 | Rp0 | 0 | Rp25m | Rp25m |
| Contingency reserve | Rp0 | Rp0 | 0 | Rp60m | Rp60m |
| **Total** | | | | | **Rp520m** |

Headroom is Rp230m; recurring run rate after the program is Rp40m/month in this illustrative configuration. Neither reserve nor forecast is automatically spent.

The Rp75m refund example assumes flat monthly fees = each account ARR/12, all five accounts eligible for one affected billing month, and a 15% remedy. These are demo assumptions; actual monthly pricing, billing-window availability, and eligibility are not established by ARR. Provide editable fee, eligibility, and affected-month inputs; show the calculation. Baseline case availability has no specified window here and must not automatically prove monthly eligibility. A scenario's seven-day fixture cannot establish a monthly refund on its own.

Optional spending approval above the Rp750m forecast ceiling is blocked with a reason; the user may revise optional costs. A mandatory obligation remains recorded even if it pushes the forecast over budget. Reallocation from contingency decreases reserve and increases the chosen cost once; do not double-count it. No automatic ROI or “Rp6bn saved” card.

### FR-10 — Guided and exploration modes

- Guided mode is an ordered narrative of about 180 seconds of presenter time, with short contextual explanations and Next Step. It pauses at actions requiring presenter/customer decisions.
- Exploration exposes the same controls and guards, not a second disconnected fake dataset.
- Main steps: customer concern → covenant → incident → diagnosis/recovery → job verification → data publication → evidence evaluation → customer review → renewal decision/budget.
- Simulated technical time, imported observation-fixture duration, and 60-day program horizon are separate concepts. Display them where relevant.
- Speed changes affect technical simulation timing only; they do not fabricate additional measurement days or customer consent.

### FR-11 — Persistence and export

- Persist schema version, scenario/run IDs, account records, jobs/outbox, incidents, pipeline, evidence, covenant versions, ledger, and event log.
- Refresh restores the same state paused; do not replay committed effects or charge costs again.
- Reset Run starts a new run without erasing prior evidence decisions or global ledger; warn that old run evidence will remain historical. Reset All explicitly restores original demo seed and clears decisions.
- Export a JSON package with schemaVersion, exportedAt, simulation=true, account/run selection, covenants, evidence, linked events, decisions, cost assumptions, and source metadata. Use a safe filename such as `servenow-toko-run-001-evidence.json`.
- Local data only; no telemetry or network transmission of demo records is needed.

## 8. Simulation engine specification

### 8.1 Structure and invariants

Use a deterministic domain engine independent of React rendering. A reducer/transition function takes state plus a typed action and returns next state plus recorded events. UI components select derived data and dispatch commands; they do not independently invent metric values.

Recommended domain modules: seed data, scenarios, transitions, guards, selectors, metrics, evidence evaluation, economics, persistence, and export. One clock controller advances scheduled domain events. Store full event records but compute dashboard summaries from canonical entities.

An event includes stable ID, sequence, runId, simulatedAt, accountId or platform scope, originating solution, event type, entity reference, and concise Indonesian description. Future scheduled actions and completed audit events are separate collections.

Keep exactly one active technical run at a time. Starting a new scenario pauses and archives the old run. Technical fixture state, simulated remote records, and their idempotency ledger are scoped to a run; replaying an operation within the same run retains its identity. A new run gets a new run ID and isolated fixture records. Historical evidence, covenants, explicit customer decisions, and the shared budget remain outside that reset boundary. Current platform health describes the active run; historical evidence always keeps the run/window it actually observed.

No negative queue counts, negative durations, double effects, cross-account evidence, or implicit customer acceptance. Invalid commands return a readable reason and do not partially mutate state.

### 8.2 Conceptual models

| Entity | Minimum fields |
|---|---|
| Account | id, name, arrIdr, renewalMonthsFromCase, concern, owner, covenantVersion, intent, contractDecision |
| Run | id, scenarioId, accountId, status, simulatedStart, simulatedNow, seed, controlParameters |
| CoreState | serviceStatus, componentStates, capacityBudget, readinessChecks, diagnosticSamples |
| Incident | id, runId, scope, severity, status, owner, cause, eligiblePlaybooks, actions, verification |
| Job | id, runId, accountId, operationId, entityId, entityVersion, operationMode, status, acceptedAt, attempts, nextAttemptAt, deadlineAt, completedAt, remoteOutcome |
| OutboxItem | id, jobId, createdAt, dispatchState, dispatchAttempts |
| RemoteEntity | runId, accountId, entityId, currentVersion, appliedOperationIds, businessEffectCount |
| Pipeline | id, runId, sourceSequence, committedCheckpoint, publishedThrough, publishedAt, requiredSources, coveredSources, batchStatus, failures |
| CovenantCriterion | id, accountId, version, kind, metric, operator, threshold, unit, scope, duration, reviewer, exclusions |
| ObservationFixture | id, accountId, runId, window, counts/sums, provenance, scenarioPrerequisites |
| Evidence | id, accountId, criterionId, covenantVersion, runId, sourceRefs, window, value, provenance, validation, customerReview |
| BudgetItem | id, category, solutionOwner, costKind, oneOffIdr, monthlyIdr, includedMonths, allowanceIdr, committedIdr, spentIdr, assumption |
| Event | id, sequence, runId, scope, simulatedAt, type, entityRef, message |

These are implementation contracts, not a demand to expose raw JSON to judges. Type names may vary if behavior remains the same.

### 8.3 Metric definitions

- Error rate = failed requests / all requests in the same account/window. Empty denominator means “Belum ada data.” Use ≤1% overall versus <1% for LogistikGo exactly.
- Mean latency = total response duration / request count for a defined window. Do not infer p95 from a mean.
- Availability = (observed duration − union of unavailable intervals) / observed duration. Avoid double-counting overlapping incidents. Display window and exclusions; current health is a separate status.
- Job completion rate = verified succeeded jobs / accepted jobs in the specified cohort. For on-time rate, denominator is jobs whose deadlines fall within the evaluated window; overdue pending jobs count as not on time and not-yet-due jobs are shown separately.
- Outstanding age = simulated now minus acceptedAt for each nonterminal unresolved job. Show needs_attention counts as well as queued/running counts.
- Freshness = simulated now minus complete-through watermark for required sources. Display per-source values and use the oldest required watermark for the aggregate. Missing coverage is incomplete, regardless of recent refresh.
- Completeness = expected fixture changes correctly represented / expected changes for the cutoff. With no expected changes and confirmed coverage, show “Lengkap, tidak ada perubahan”; otherwise unknown is not 100%.
- Recovery time = detection-to-verified-recovery duration for a specified incident; do not call a single incident MTTR.
- Budget headroom = ceiling minus total 60-day forecast including reserve/provisions, with stable line-item deduplication.

### 8.4 Observation windows and fixture replay

A short interactive run cannot prove seven-day or monthly SLAs. Support an explicit **Muat periode bukti contoh** action after relevant scenario prerequisites pass. It imports a clearly labeled deterministic aggregate observation fixture with its own start/end window; it does not overwrite live run counters.

Example seven-day fixture: observedSeconds=604800; unavailableSeconds=240; totalRequests=1000; failedRequests=5; totalResponseMs=500000. Derived availability ≈99.9603%, error=0.5%, mean=500ms. These are small illustrative aggregate records, not a real load benchmark or a promise at 1,400 RPS. Include a failing fixture with failedRequests=15, giving 1.5% error. Do not silently choose a passing fixture when unresolved relevant conditions remain.

Fixtures are explicitly attached to an account and run. Customer-required periods longer than the fixture remain incomplete. Different criteria can reference different valid windows. Live freshness must not decay or improve incorrectly when an evidence fixture is loaded: its historical window is separate from the live simulation clock.

Optional manual evidence fixtures for access review, data-location review, or medical workflow review must be marked illustrative and intentionally loaded. They do not assert actual compliance or verified hosting location.

## 9. Scenarios and deterministic outcomes

### S1 — Lonjakan tiket + CRM melambat (default, TokoCepat)

Initial conditions: selected account TokoCepat, no accepted covenant yet, core constrained in a defined demo workload, remote dependency slow, zero newly accepted jobs. Guide user to agree the demo covenant, inject the incident, assign owner, inspect findings, and apply the scenario's connection/workload control.

Create 10 ticket-update jobs with stable operation IDs when the presenter clicks **Kirim 10 pembaruan contoh**. Of these, eight can complete normally once prerequisites allow, one fails transiently on its first attempt then succeeds on bounded retry, and one commits remotely but loses its acknowledgment. The latter stays needs_verification until the user checks the remote result. Then it becomes succeeded without another business effect.

Use compact sample concurrency/quota values in a visible “Asumsi demo” configuration: two active integration workers, an aggregate remote dispatch limit of two attempts/second, and a core job-concurrency budget of two after mitigation. Use a four-second remote response for the slow-dependency fixture. Allow at most three total attempts for safe temporary failure, with a two-second base retry delay and an eight-second cap; any jitter must use the run seed. None of these values is a production sizing recommendation. A seeded default must permit all jobs to complete within the illustrative 60-second job deadline with a reasonable sequence of technical actions. Guided pauses suspend technical time, so reading the narrative does not unfairly age jobs. Exploration may intentionally create overdue jobs.

After data validation/publication, evidence shows the exact completed cohort and zero unresolved reconciliation differences. Load a separate observation fixture only if a covenant needs a longer window. Customer review and renewal require separate explicit actions. End state is an example accepted/renewed decision for TokoCepat only; the other four remain independently managed.

### S2 — Komponen layanan gagal (Bank FinNusantara)

Prepare a proposed standby configuration in demo state. Inject failure, assign owner, diagnose the affected component, and run a matching recovery playbook. Invalid recovery actions remain disabled with reasons. Verification includes service readiness and an integrity check. Workers resume only when their dependencies are ready.

Recovery outcome creates evidence for that incident. Availability evidence requires its own adequate observation window. Security/compliance remains a separate gap until a labeled review fixture is intentionally supplied. Demonstrate **Minta perbaikan** creating a follow-up rather than forcing a fully green customer status.

### S3 — Pipeline data gagal (TeleNusa)

Start from a valid old publication with a known source checkpoint. New source changes include an update, a late update, and a delete. Inject a schema/validation failure during the next batch. Verify that the complete-through watermark and checkpoint do not advance; old dashboard content persists with stale/incomplete labels.

Correct the fixture's mapping, replay from the checkpoint, validate and publish once. The resulting row counts and versions match the source changes, without duplicate effects. Generate freshness/completeness evidence for TeleNusa. A new browser refresh without a successful batch does not change the evidence.

### Negative explorations supported in all modes

- Accept evidence before its required data exists: blocked with the missing criterion.
- Retry an ambiguous operation without verification: blocked with next action.
- Increase worker count beyond core capacity or dependency quota: capped/blocked with reason, not instant improvement.
- Edit covenant after acceptance: prior review shown outdated for the new covenant.
- Add optional spending above forecast ceiling: approval blocked; revise costs.
- Reload mid-run: same records, paused, no duplicated effects.

## 10. Main guided demonstration script

This timing describes presenter pacing, not automatic progression or real observation duration.

| Approx. time | Screen/action | What the judge learns |
|---|---|---|
| 0:00–0:25 | Overview: select TokoCepat; inspect concern and covenant | Customer needs determine the proof required |
| 0:25–0:50 | Inject S1; Core: inspect diagnosis and capacity action | Integration depends on a stable resource foundation |
| 0:50–1:25 | Flow: send sample updates; inspect queue and ambiguous job | Acceptance is fast, completion is tracked and verified |
| 1:25–1:45 | Data tab: publish a valid incremental batch | Operational information has an explicit freshness/completeness boundary |
| 1:45–2:15 | Trust: collect and validate evidence; inspect source links | A technical result becomes reviewable customer evidence |
| 2:15–2:40 | Demo customer perspective: accept or request correction | Customer acceptance is an explicit decision |
| 2:40–3:00 | Renewal and budget; return to overview | Retention decisions and economics close the loop |

An explanation line accompanies each step. Do not forcibly move the presenter to the next page on a short timer. A guided replay can automate ordinary technical events but must pause at covenant, acceptance, and renewal decisions.

## 11. Engineering and deployment requirements

- Preferred fresh-project stack: React + TypeScript + Vite; Tailwind CSS or a consistent equivalent; lightweight shared store; Lucide icons; SVG diagrams; a modest chart dependency if needed.
- Preserve an existing compatible app framework. Pin installed dependency versions with a lockfile and use official current setup guidance.
- No backend or external credentials are required. Keep the runtime usable after static assets load, without external API calls or hotlinked visual assets.
- Organize domain logic separately from components. Suggested directories: `src/domain`, `src/data`, `src/store`, `src/components`, `src/pages`, `src/styles`, `src/tests`.
- Required scripts: dev, build, typecheck, and test. Add lint if the project uses it consistently. Do not introduce a large framework solely for a trivial check.
- Vite deployment uses a static production bundle in `dist`; configure Vercel SPA deep-link fallback as appropriate. Do not apply Vite-specific rewrites blindly to a different framework.
- Provide README instructions for local setup, Node requirements actually chosen, environment variables (none by default), build, preview, and Vercel repository import. Do not deploy automatically.
- Demo hosting does not establish production Indonesian data residency. Use synthetic records and show the residency requirement as an evidence item for the proposed production system.
- Prefer keyboard-accessible controls, visible focus states, labeled icons, semantic table headings, text equivalents for charts, and reduced motion. Dialog focus should return to its trigger.
- Disable duplicate action submissions; handle missing selections, impossible transitions, and persistence failures clearly.

Official implementation references, checked 26 September 2026:

- Vite deployment on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Lovable GitHub sync: https://docs.lovable.dev/integrations/github
- Lovable external deployment: https://docs.lovable.dev/tips-tricks/external-deployment-hosting
- Lovable publishing: https://docs.lovable.dev/features/publish
- Transactional outbox concept: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html
- Celery task concepts: https://docs.celeryq.dev/en/stable/userguide/tasks.html

These references explain tools and concepts; no cloud provider choice is a case requirement. The app simulates the domain rather than deploying the production architecture.

## 12. Acceptance criteria and meaningful tests

| ID | Given / action | Expected result |
|---|---|---|
| AC-01 | Open a fresh app | All three solutions and five accounts are visible; TokoCepat/S1 selected; demo paused; no pre-accepted evidence |
| AC-02 | Navigate all four routes and reload a deep link | Correct page loads; shared records persist; no extra timers |
| AC-03 | Attempt async acceptance when local commit fails | No accepted job or dispatched message; clear failure |
| AC-04 | Commit succeeds but publisher fails | Outbox/job remain; later dispatch succeeds without creating another operation |
| AC-05 | Run S1; verify the ambiguous job | All intended business effects occur once; the ambiguous job completes through verification |
| AC-06 | Force permanent error or exceed retry bound | Job enters actionable needs_attention, with no endless automatic retry |
| AC-07 | Apply duplicate or outdated operation | No extra business effect or stale overwrite; traceable event explains outcome |
| AC-08 | Fail a data batch | Checkpoint, published data, and complete-through watermark remain unchanged |
| AC-09 | Correct and replay the batch | Update/late-update/delete are represented exactly once; coverage and freshness are derived correctly |
| AC-10 | Change selected customer | Existing records retain original account; no evidence leaks to another account |
| AC-11 | Collect evidence with wrong version/window/scope | It stays incomplete/outdated; cannot become customer-accepted as current evidence |
| AC-12 | Pass technical checks without customer decision | Evidence can be reviewable, but no acceptance or renewal occurs automatically |
| AC-13 | Edit an accepted covenant | Old acceptance remains history, marked outdated; new version requires evaluation/review |
| AC-14 | Error is exactly 1% | Overall ≤1% criterion passes; LogistikGo's <1% criterion fails |
| AC-15 | Zero requests or incomplete source coverage | Show no data/incomplete, not false 0% error or complete fresh data |
| AC-16 | Load the seven-day aggregate fixture | Derived values match counts and window; live run stats remain separate |
| AC-17 | Replay scenario or reload storage | No duplicated ledger charges, remote effects, or accepted customer decisions |
| AC-18 | Use default illustrative budget | Forecast Rp520m, headroom Rp230m, monthly continuation Rp40m; not reported as money already spent |
| AC-19 | Exceed budget with optional versus mandatory cost | Optional approval blocked; mandatory liability remains visible and forecast overrun flagged |
| AC-20 | Execute S2 without required readiness | Invalid failover blocked; verification required; compliance not auto-passed |
| AC-21 | Pause, change route, hide tab, reload | Technical time behaves predictably; restore paused; no clock jumps from browser wall time |
| AC-22 | Export evidence JSON | Includes account/run/window/version/provenance and simulation flag; no false signed document |
| AC-23 | Keyboard/reduced-motion/mobile use | Main journey remains operable and understandable |
| AC-24 | Production build/typecheck and browser walkthrough | Build passes; no observed console errors, dead buttons, diagram overlap, or clipped key content |

Use unit tests for domain guards, formulas, idempotency, checkpoints, budget totals, and version invalidation. Use a few browser tests for the integrated S1 path, S3 failure/replay, and persistence. Do not spend effort on tests that merely repeat static UI strings.

## 13. Delivery checklist

- Runnable source, manifest, lockfile, and framework-appropriate deployment config.
- Complete four-page implementation and all three scenarios.
- README with commands, assumptions, architecture, and deployment instructions.
- DEMO_SCRIPT.md with guided sequence and alternative scenario instructions.
- Meaningful test results and screenshots inspected at 1440×900, 1280×720, and approximately 390×844.
- A brief factual completion report: implemented features, checks executed, limitations, local URL if running.
- Preserve these handoff documents. Record necessary deviations in README with reasons; do not quietly drop a solution or rewrite source facts.

Definition of done: a user can complete the full customer-to-recovery-to-evidence-to-decision journey, observe and resolve the specified failures, inspect the underlying evidence and economics, and deploy the completed demo without connecting a real enterprise system.
