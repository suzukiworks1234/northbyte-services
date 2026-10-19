# How to flatten nested Apify Dataset JSON into CSV-ready columns (without writing code)

**Use case:** You have an Apify Actor output Dataset with nested objects such as `company.name`, `company.location.city`, or `role.title`. You want named, top-level fields to work with in a spreadsheet, CRM import, or downstream Apify workflow—without writing a one-off transformation script.

**Quick start:** [Open Dataset JSON Flattener on Apify](https://apify.com/starshaped_bullsnake/dataset-json-flattener?utm_source=github&utm_medium=guide&utm_campaign=flattener_sales_engine_20261019). Check current pricing and set an appropriate run-cost limit before you start.

## The problem: nested fields in scraped data

Many Actors output records resembling this **fictional** example:

```json
[
  {
    "id": "L001",
    "company": { "name": "Northline Labs", "location": { "city": "Leeds" } },
    "role": { "title": "Data Analyst", "remote": true }
  },
  {
    "id": "L002",
    "company": { "name": "Harbor Studio", "location": { "city": "Bristol" } },
    "role": { "title": "Automation Engineer", "remote": false }
  }
]
```

A spreadsheet works best when `company.name`, `company.location.city`, and `role.title` appear as separate top-level columns rather than nested objects.

## Option A: convert rows already in an Apify Dataset

1. Open the run that produced your nested JSON. Find its **Dataset** in the Output tab and note its Dataset ID (or use the Dataset picker in your account).
2. [Open Dataset JSON Flattener](https://apify.com/starshaped_bullsnake/dataset-json-flattener?utm_source=github&utm_medium=guide&utm_campaign=flattener_sales_engine_20261019) and choose the **Input** tab.
3. In **Source Dataset**, select the existing Dataset or supply its ID. This requests *READ* access to that Dataset; it does **not** overwrite your source. The selected source takes precedence over inline example rows.
4. Leave **Key separator** set to `.` for standard dot-path keys, or change it to `_` if your destination system prefers underscores.
5. **Review the Pricing panel and run options first.** Set a spending limit suitable for your test; this is a paid Actor and rerunning the same records can incur charges again.
6. Start the run. When it finishes successfully, open the new **Output Dataset** and export it as **CSV** or **Excel** using Apify's standard Dataset export controls.

The flattened output is another Dataset. The Actor does not create a standalone `.csv` file itself.

## Option B: test the shape with two inline rows

You do not need a source Dataset to see the transformation. Leave **Source Dataset** empty, replace **Inline rows** with these fictional rows, and use `.` as the separator:

```json
[
  {"id":"L001","company":{"name":"Northline Labs","location":{"city":"Leeds"}},"role":{"title":"Data Analyst","remote":true}},
  {"id":"L002","company":{"name":"Harbor Studio","location":{"city":"Bristol"}},"role":{"title":"Automation Engineer","remote":false}}
]
```

Expected Dataset items:

```json
[
  {"id":"L001","company.name":"Northline Labs","company.location.city":"Leeds","role.title":"Data Analyst","role.remote":true},
  {"id":"L002","company.name":"Harbor Studio","company.location.city":"Bristol","role.title":"Automation Engineer","role.remote":false}
]
```

You can then export columns `id`, `company.name`, `company.location.city`, `role.title` and `role.remote`.

**Important:** Those rows are an illustration, not evidence of a new live run. Apify run charges still apply when you execute them.

## When *not* to use a separate Actor

If you only need to flatten a few fields **once during an export**, Apify's native Dataset export/API offers a `flatten` transformation for selected fields. That can be simpler than starting another Actor:

- [Apify Dataset API: export and field options](https://docs.apify.com/storage/dataset)
- [Apify API: `flatten` query option](https://docs.apify.com/api/v2/actor-run-dataset-items-get)

Choose **Dataset JSON Flattener** when you instead want **a separate, persisted flat Dataset** that you can inspect, export repeatedly, or pass to a downstream workflow, or when you want a custom separator for the flattened paths. It does not provide deduplication, filtering, row joins, array expansion, or CSV-file generation beyond Apify's ordinary Dataset export.

## Limitations that matter in production

- **Arrays stay arrays.** This is not a one-value-per-spreadsheet-cell guarantee.
- **Empty objects and nulls stay unchanged.** Non-empty nested plain objects turn into flat keys.
- **Existing dotted keys may collide** with newly flattened paths; a later assignment wins. Inspect a small sample first if your source already uses dots in field names.
- **Source Dataset permissions apply.** You can read only datasets permitted for the run; private data is not made public by the guide.
- **Failed or interrupted runs can leave partial output.** Check the run status and logs, not just a non-empty output. Repeating a run can produce additional charges.
- **Cost is not zero.** The [live Apify Pricing panel](https://apify.com/starshaped_bullsnake/dataset-json-flattener) is authoritative; charges depend on actual usage and configuration.

## Suggested workflow

`Existing Apify scraper → source Dataset → Dataset JSON Flattener → new flat Dataset → CSV/Excel export or automation`

If your export has deeply nested job, product, or lead records, test with two fictional rows first, verify the column names, and then decide whether a full run is worth the cost.

**[Open the Actor and review the ready-to-use example →](https://apify.com/starshaped_bullsnake/dataset-json-flattener?utm_source=github&utm_medium=guide&utm_campaign=flattener_sales_engine_20261019)**

---

Published by [Northbyte Services](https://github.com/suzukiworks1234/northbyte-services), a software and data-automation service. This guide is independent documentation and is not endorsed by Apify. Examples are fictional and contain no customer data.
