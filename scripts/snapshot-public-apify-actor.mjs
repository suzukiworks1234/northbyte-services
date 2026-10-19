// Public-only observation of a published Apify Actor. No API token and no Actor Run.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const actor = 'starshaped_bullsnake~dataset-json-flattener';
const sourceUrl = `https://api.apify.com/v2/acts/${actor}`;
const storeUrl = 'https://apify.com/starshaped_bullsnake/dataset-json-flattener';
const n = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
const localDate = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo',
}).format(new Date());

const response = await fetch(sourceUrl, {
    headers: { accept: 'application/json', 'user-agent': 'northbyte-flattener-public-stats/1.0' },
    signal: AbortSignal.timeout(15_000),
});
if (!response.ok) throw new Error(`PUBLIC_ACTOR_STATS_UNAVAILABLE: HTTP ${response.status}`);
const body = await response.json();
const data = body?.data;
if (!data || data.isPublic !== true || data.name !== 'dataset-json-flattener') {
    throw new Error('PUBLIC_ACTOR_RESPONSE_UNEXPECTED');
}
const stats = data.stats ?? {};
const external = stats.publicActorRunStats30Days;
const statusKeys = ['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT', 'TOTAL'];
const publicRunStatuses30Days = external && typeof external === 'object'
    ? Object.fromEntries(statusKeys.map((key) => [key, n(external[key])]))
    : null;

const snapshot = {
    capturedAt: new Date().toISOString(),
    localDateJST: localDate,
    source: sourceUrl,
    actor: {
        id: data.id ?? null,
        name: data.name,
        storeUrl,
        isPublic: data.isPublic,
    },
    publicStats: {
        totalRunsIncludingOwner: n(stats.totalRuns),
        totalUsersIncludingOwner: n(stats.totalUsers),
        totalUsers7DaysIncludingOwner: n(stats.totalUsers7Days),
        totalUsers30DaysIncludingOwner: n(stats.totalUsers30Days),
        totalUsers90DaysIncludingOwner: n(stats.totalUsers90Days),
        bookmarks: n(stats.bookmarkCount),
        reviewCount: n(stats.actorReviewCount),
        publicRunStatuses30DaysExcludingOwner: publicRunStatuses30Days,
    },
    interpretation: {
        publicRunStatuses30DaysExcludingOwner: 'Rolling 30-day counts; owner runs excluded by Apify. Changes between snapshots are NOT daily run counts.',
        totalUsers: 'Unique Actor users INCLUDING the owner. Not equivalent to paying customers.',
        conversionAttribution: 'UNAVAILABLE: no verified referral-to-paid-user linkage.',
    },
    unavailableWithoutAuthenticatedReporting: [
        'actorDetailVisits', 'actorInputPageVisits', 'trialToStartConversion',
        'paidExternalUsers', 'paidEventLedger', 'grossRevenueUsd',
        'platformCostsUsd', 'netProfitUsd', 'trafficByCampaign',
    ],
};

const dir = join('metrics', 'apify-flattener');
await mkdir(dir, { recursive: true });
const path = join(dir, `${localDate}.json`);
await writeFile(path, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
    output: path, date: localDate,
    totalUsersIncludingOwner: snapshot.publicStats.totalUsersIncludingOwner,
    monthlyUsersIncludingOwner: snapshot.publicStats.totalUsers30DaysIncludingOwner,
    externalRolling30DayRuns: publicRunStatuses30Days?.TOTAL ?? null,
    paidCustomers: 'UNAVAILABLE', netProfit: 'UNAVAILABLE',
}));
