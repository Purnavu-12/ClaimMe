import test from "node:test";
import assert from "node:assert/strict";
import {
  buildGrievance,
  calculateSettlement,
  correctField,
  emptyDemo,
  migrateDemo,
  stateAt,
} from "../src/domain/engine";
import { documents, events } from "../src/domain/fixtures";
import { BrowserDemoRepository, STORAGE_KEY } from "../src/domain/repository";
test("settlement preserves paise and applies co-pay after adjustments", () => {
  assert.deepEqual(calculateSettlement(), {
    bill: 10000000,
    nonpayable: 500000,
    sublimit: 1000000,
    base: 8500000,
    copay: 850000,
    total: 7650000,
  });
  assert.equal(calculateSettlement(101, 0, 0, 10).total, 91);
  assert.equal(calculateSettlement(100, 0, 0, 0).total, 100);
  assert.equal(calculateSettlement(100, 0, 0, 100).total, 0);
});
test("invalid and overdrawn settlement inputs are rejected", () => {
  for (const args of [
    [100, 101, 0, 10],
    [-1, 0, 0, 10],
    [100, 0, 0, 101],
    [100, 0, 0, NaN],
    [1.5, 0, 0, 10],
  ])
    assert.throws(() =>
      calculateSettlement(...(args as [number, number, number, number])),
    );
});
test("returning to review retains independent unresolved dimensions and immutable history", () => {
  const before = JSON.stringify(events);
  const state = stateAt(4);
  assert.equal(state.processing, "Under review");
  assert.equal(state.coverage, "Continuity unresolved");
  assert.equal(state.evidence, "Clarification required");
  assert.equal(state.settlement, "Not started");
  assert.equal(stateAt(2).processing, "Awaiting information");
  assert.equal(stateAt(7).settlement, "Partial settlement recorded");
  assert.equal(JSON.stringify(events), before);
});
test("earlier snapshots do not expose future evidence", () => {
  assert(!events[2].documentIds.includes("settlement"));
  assert(!events[2].documentIds.includes("discharge"));
  assert(events[3].documentIds.includes("discharge"));
  assert.equal(stateAt(5).risk, "Manual review");
  assert.equal(stateAt(4).risk, "No review reported");
});
test("correction appends provenance without mutating source or history", () => {
  const initial = emptyDemo();
  const doc = JSON.stringify(documents);
  const first = correctField(
    initial,
    "bill-date",
    "2026-10-13",
    "OCR used the billing date",
    "2026-10-24T10:00:00Z",
  );
  const next = correctField(
    first,
    "bill-date",
    "2026-10-12",
    "Rechecked source",
    "2026-10-24T10:01:00Z",
  );
  assert.equal(first.audit[0].previous, "2026-10-12");
  assert.equal(next.audit[1].previous, "2026-10-13");
  assert.equal(next.audit.length, 2);
  assert.equal(initial.audit.length, 0);
  assert.equal(JSON.stringify(documents), doc);
  assert.equal(stateAt(7).evidence, "Clarification required");
});
test("correction requires recognized field, valid date and reason", () => {
  for (const [id, date, reason] of [
    ["unknown", "2026-10-13", "test"],
    ["bill-date", "not a date", "test"],
    ["bill-date", "2026-10-13", " "],
  ])
    assert.throws(() => correctField(emptyDemo(), id, date, reason));
});
test("draft exports supported questions and separates unsupported customer statements", () => {
  const state = emptyDemo();
  state.dispute = {
    assertions: ["date", "sublimit", "guaranteed-approval"],
    statement: "I believe I should receive the entire amount.",
  };
  const draft = buildGrievance(state);
  assert.equal(draft.issues.length, 2);
  assert(draft.customerStatement.includes("entire amount"));
  assert(draft.unsupportedAssertions.length);
  assert(draft.missingEvidence.includes("Renewal payment receipt"));
  assert(draft.evidenceIndex.every((e) => e.synthetic));
  assert(!JSON.stringify(draft.issues).includes("guaranteed-approval"));
});
test("migration rejects malformed state and retains safe version-one changes", () => {
  assert.deepEqual(migrateDemo(null), emptyDemo());
  assert.deepEqual(migrateDemo({ version: 99 }), emptyDemo());
  const migrated = migrateDemo({
    version: 1,
    corrections: { "bill-date": "2026-10-13", unknown: "secret" },
    completedActions: ["date", 22],
    dispute: { assertions: ["date", "fraud"], statement: "Synthetic account" },
  });
  assert.equal(migrated.version, 2);
  assert.deepEqual(migrated.corrections, { "bill-date": "2026-10-13" });
  assert.deepEqual(migrated.completedActions, ["date"]);
  assert.deepEqual(migrated.dispute.assertions, ["date"]);
});
test("browser repository persists, recovers corrupt data, migrates and resets both versions", () => {
  const data = new Map<string, string>();
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
  const repo = new BrowserDemoRepository(storage);
  data.set(
    "claimme-demo-v1",
    JSON.stringify({ version: 1, completedActions: ["date"] }),
  );
  assert.deepEqual(repo.load().completedActions, ["date"]);
  repo.save(repo.load());
  assert(data.has(STORAGE_KEY));
  repo.reset();
  assert.equal(data.size, 0);
  assert.deepEqual(repo.load(), emptyDemo());
  data.set(STORAGE_KEY, "{broken");
  assert.deepEqual(repo.load(), emptyDemo());
});
