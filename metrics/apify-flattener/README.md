# Dataset JSON Flattener — public usage snapshots

This folder is populated by [flattener-public-metrics.yml](../../.github/workflows/flattener-public-metrics.yml). The workflow uses **only the published Actor's public Apify API**, without credentials, paid proxy, or an Actor execution.

- **Source:** [public Apify Actor metadata](https://api.apify.com/v2/acts/starshaped_bullsnake~dataset-json-flattener)
- **Schedule:** daily at approximately 09:23 JST (GitHub scheduled jobs may be delayed).
- **Output:** one `YYYY-MM-DD.json` file per JST calendar date, overwritten with the latest capture if the job runs again that day.
- **Cost model:** a standard GitHub-hosted runner in a **public** GitHub repository, which GitHub currently lists as free. The workflow makes only one public HTTPS GET to Apify; it does not start the Actor or cause Apify usage charges.
- **Visibility:** these are **public** usage statistics already provided by Apify. Do not add private monetization, customer, payment, or account data here.

## What the data does and does not prove

| Field | Meaning | Can it prove external paid demand? |
| --- | --- | --- |
| `totalUsersIncludingOwner` | All-time unique users, including the publisher | No |
| `totalUsers30DaysIncludingOwner` | Rolling 30-day active users, including the publisher | No |
| `totalRunsIncludingOwner` | All-time Actor executions, including publisher tests | No |
| `publicRunStatuses30DaysExcludingOwner` | Apify's public 30-day run status buckets; excludes owner runs | **External activity**, but not proof of paid usage |
| `reviewCount` / `bookmarks` | Store social signals | No |
| `unavailableWithoutAuthenticatedReporting` | Funnel, paid customer count, event ledger, revenue, cost, profit, UTM source conversion | Unknown, do not infer zero |

All 30-day measures have **moving windows**. Comparing today's rolling count with yesterday's gives a *net change to the rolling window*, not the number of new runs. Missing statistics are recorded as `null`, not zero.

To establish paid conversion and profit, use authenticated Apify **Monetization**, **Acquisition**, and billing/event records and exclude owner QA. Do not substitute public run totals, page reads, GitHub views, or UTM-tagged clicks for this evidence.

## Sales Engine R1 review schedule

- Day 7 (2026-10-26 JST): verify discoverability/traffic and external 30-day run-status trend. If no sign of external usage, test another relevant distribution surface rather than rewriting the Actor.
- Day 14 (2026-11-02 JST): investigate input-page/run funnel where authenticated metrics are available; improve one specific point of friction only when supported by evidence.
- Day 30 (2026-11-18 JST): decide **CONTINUE / PIVOT / STOP** using external paid users and recorded profit where available. If unavailable, state `UNVERIFIED` and decide whether the free distribution experiment merits extension.

Record each evaluation with its exact data window, identity classification, costs, source, and next action. Make no cost-bearing Apify Runs or pricing changes as part of observation.

## Failure response and rollback

If the external API fails, parsing does not match the expected published Actor, or a job fails, **do not overwrite previous snapshots with invented zeroes**. The workflow fails and preserves existing files. Review the failure and fix the collector only; never run the Actor to repair a stats collection failure.

To stop monitoring, remove the cron schedule from `.github/workflows/flattener-public-metrics.yml` (or disable the workflow in GitHub Actions). To revert the entire Sales Engine R1 publishing change, revert the relevant PRs; deleting snapshots is unnecessary.

This data collection is independent of the public [how-to guide](../../guides/apify-dataset-nested-json-to-csv.md).
