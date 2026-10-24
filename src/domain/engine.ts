import { events, initialState, clauses, documents, messages } from "./fixtures";
import type {
  AuditEntry,
  ClaimEvent,
  DemoState,
  SettlementLine,
} from "./model";
export const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
export function stateAt(index: number, history: ClaimEvent[] = events) {
  return history
    .slice(0, Math.max(0, index + 1))
    .reduce((state, event) => ({ ...state, ...event.state }), {
      ...initialState,
    });
}
export function calculateSettlement(
  bill = 10000000,
  nonpayable = 500000,
  sublimit = 1000000,
  copayPercent = 10,
) {
  if (
    ![bill, nonpayable, sublimit].every(
      (n) => Number.isSafeInteger(n) && n >= 0,
    ) ||
    !Number.isFinite(copayPercent) ||
    copayPercent < 0 ||
    copayPercent > 100 ||
    nonpayable + sublimit > bill
  )
    throw new Error("Invalid settlement inputs");
  const base = bill - nonpayable - sublimit;
  const copay = Math.round((base * copayPercent) / 100);
  return { bill, nonpayable, sublimit, base, copay, total: base - copay };
}
export const settlement = calculateSettlement();
export const settlementLines: SettlementLine[] = [
  {
    id: "nonpayable",
    label: "Non-payable items",
    amount: settlement.nonpayable,
    base: settlement.bill,
    formula: "₹1,00,000 − ₹5,000 = ₹95,000",
    explanation:
      "The example letter groups ₹5,000 as non-payable items. An itemized list is needed to verify each expense.",
    source: { documentId: "settlement", label: "Settlement letter", page: 1 },
  },
  {
    id: "sublimit",
    label: "Sub-limit adjustment",
    amount: settlement.sublimit,
    base: 9500000,
    formula: "₹95,000 − ₹10,000 = ₹85,000",
    explanation:
      "The letter applies ₹10,000 under the room-related sub-limit. The policy schedule needed to check the cap has not been supplied.",
    policy: "sublimit",
    source: { documentId: "settlement", label: "Settlement letter", page: 1 },
  },
  {
    id: "copay",
    label: "10% co-pay",
    amount: settlement.copay,
    base: settlement.base,
    formula: "10% × ₹85,000 = ₹8,500",
    explanation:
      "The example policy applies 10% to the admissible amount after the earlier adjustments. This ordering is specific to this synthetic scenario.",
    policy: "copay",
    source: { documentId: "settlement", label: "Settlement letter", page: 1 },
  },
];
export function emptyDemo(): DemoState {
  return {
    version: 2,
    corrections: {},
    completedActions: [],
    audit: [],
    dispute: { statement: "", assertions: [] },
    consent: { localDemo: false, at: null },
    preferences: { name: "Aarav", notifications: true },
    onboarding: { intent: "Understand my claim", hasClaim: "Yes" },
  };
}
export function migrateDemo(raw: unknown): DemoState {
  if (!raw || typeof raw !== "object") return emptyDemo();
  const data = raw as Record<string, unknown>;
  if (data.version !== 1 && data.version !== 2) return emptyDemo();
  const base = emptyDemo();
  const corrections =
    data.corrections && typeof data.corrections === "object"
      ? Object.fromEntries(
          Object.entries(data.corrections).filter(
            ([id, v]) =>
              ["bill-date", "discharge-date"].includes(id) &&
              typeof v === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(v),
          ),
        )
      : {};
  return {
    ...base,
    corrections,
    completedActions: Array.isArray(data.completedActions)
      ? data.completedActions.filter(
          (v): v is string =>
            typeof v === "string" &&
            ["date", "renewal", "deduction"].includes(v),
        )
      : [],
    audit: Array.isArray(data.audit)
      ? data.audit.filter(
          (v): v is AuditEntry =>
            !!v &&
            typeof v === "object" &&
            typeof v.description === "string" &&
            typeof v.at === "string" &&
            typeof v.id === "string",
        )
      : [],
    dispute:
      data.dispute && typeof data.dispute === "object"
        ? {
            statement:
              typeof (data.dispute as Record<string, unknown>).statement ===
              "string"
                ? String((data.dispute as Record<string, unknown>).statement)
                : "",
            assertions: Array.isArray(
              (data.dispute as Record<string, unknown>).assertions,
            )
              ? (
                  (data.dispute as Record<string, unknown>)
                    .assertions as unknown[]
                ).filter(
                  (v): v is string =>
                    typeof v === "string" && ["date", "sublimit"].includes(v),
                )
              : [],
          }
        : base.dispute,
    consent:
      data.consent && typeof data.consent === "object"
        ? {
            localDemo:
              (data.consent as Record<string, unknown>).localDemo === true,
            at:
              typeof (data.consent as Record<string, unknown>).at === "string"
                ? String((data.consent as Record<string, unknown>).at)
                : null,
          }
        : base.consent,
    preferences:
      data.preferences && typeof data.preferences === "object"
        ? {
            name:
              typeof (data.preferences as Record<string, unknown>).name ===
              "string"
                ? String(
                    (data.preferences as Record<string, unknown>).name,
                  ).slice(0, 60)
                : "Aarav",
            notifications:
              (data.preferences as Record<string, unknown>).notifications !==
              false,
          }
        : base.preferences,
    onboarding:
      data.onboarding && typeof data.onboarding === "object"
        ? {
            intent:
              typeof (data.onboarding as Record<string, unknown>).intent ===
              "string"
                ? String(
                    (data.onboarding as Record<string, unknown>).intent,
                  ).slice(0, 100)
                : base.onboarding.intent,
            hasClaim:
              typeof (data.onboarding as Record<string, unknown>).hasClaim ===
              "string"
                ? String(
                    (data.onboarding as Record<string, unknown>).hasClaim,
                  ).slice(0, 100)
                : "Yes",
          }
        : base.onboarding,
  };
}
export function correctField(
  state: DemoState,
  fieldId: string,
  value: string,
  reason: string,
  at = new Date().toISOString(),
): DemoState {
  const field = documents
    .flatMap((d) => d.fields)
    .find((f) => f.id === fieldId);
  if (
    !field ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value ||
    !reason.trim()
  )
    throw new Error("A valid date and reason are required");
  const previous = state.corrections[fieldId] ?? field.value;
  return {
    ...state,
    corrections: { ...state.corrections, [fieldId]: value },
    audit: [
      ...state.audit,
      {
        id: `correction-${state.audit.length}-${at}`,
        at,
        actor: "Demo customer",
        kind: "correction",
        fieldId,
        previous,
        value,
        reason: reason.trim(),
        description: `${field.label} corrected from ${previous} to ${value}. Original document preserved.`,
      },
    ],
  };
}
export function buildGrievance(state: DemoState) {
  const supported = state.dispute.assertions.filter((id) =>
    ["date", "sublimit"].includes(id),
  );
  return {
    title: "DRAFT — Synthetic grievance pack",
    claim: "CM-1024",
    notice:
      "Illustrative material. Not submitted to any insurer or authority. Customer statements are unverified.",
    issues: supported.map((id) =>
      id === "date"
        ? {
            question:
              "Please verify the discharge date recorded differently in two documents.",
            sources: ["bill p.1", "discharge p.1"],
            customerCorrections: state.audit.filter(
              (a) => a.kind === "correction",
            ),
          }
        : {
            question:
              "Please provide the room schedule and calculation supporting the ₹10,000 adjustment.",
            sources: ["settlement p.1", "policy clause 4.3"],
            missingEvidence: ["Room schedule"],
          },
    ),
    timeline: events,
    evidenceIndex: documents.map(({ id, title, excerpt }) => ({
      id,
      title,
      synthetic: true,
      excerpt,
    })),
    policyReferences: clauses,
    communicationHistory: messages,
    calculation: settlement,
    customerStatement: state.dispute.statement,
    unsupportedAssertions: [
      "Coverage entitlement, misconduct, and approval guarantees are not established.",
    ],
    missingEvidence: [
      "Renewal payment receipt",
      "Room schedule",
      "Payment confirmation",
    ],
  };
}
