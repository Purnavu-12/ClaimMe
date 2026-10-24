import type {
  ActionItem,
  Claim,
  ClaimEvent,
  EvidenceConflict,
  EvidenceDocument,
  Message,
  PolicyClause,
  Source,
} from "./model";
export const source = (
  documentId: string,
  label: string,
  page = 1,
): Source => ({ documentId, label, page });
export const initialState = {
  processing: "Submitted",
  evidence: "Received",
  coverage: "Continuity unresolved",
  risk: "No review reported",
  settlement: "Not started",
  dispute: "None",
};
export const claims: Claim[] = [
  {
    id: "CM-1024",
    insurer: "Example Health Insurance",
    hospital: "City Care Hospital",
    patient: "Aarav Sharma",
    type: "Reimbursement",
    amount: 10000000,
    status: "Needs attention",
    date: "2026-10-24",
    summary:
      "A settlement is recorded. One document date and policy continuity still need verification.",
    state: {
      processing: "Settlement recorded",
      evidence: "Clarification required",
      coverage: "Continuity unresolved",
      risk: "Review completed",
      settlement: "Partial settlement recorded",
      dispute: "Not started",
    },
  },
  {
    id: "CM-1018",
    insurer: "Example Health Insurance",
    hospital: "Greenfield Clinic",
    patient: "Aarav Sharma",
    type: "Cashless",
    amount: 4200000,
    status: "Settled",
    date: "2026-09-20",
    summary: "Synthetic cashless claim settled. No open actions recorded.",
    state: {
      ...initialState,
      processing: "Settled",
      evidence: "Verified",
      coverage: "Confirmed in example",
      settlement: "Paid",
    },
  },
  {
    id: "CM-1003",
    insurer: "Example Health Insurance",
    hospital: "Lakeside Hospital",
    patient: "Aarav Sharma",
    type: "Reimbursement",
    amount: 1800000,
    status: "Closed",
    date: "2026-08-12",
    summary:
      "Synthetic claim withdrawn by the customer. No insurer decision inferred.",
    state: {
      ...initialState,
      processing: "Withdrawn",
      settlement: "Not applicable",
    },
  },
];
const eventLog: ClaimEvent[] = [
  {
    id: "e1",
    date: "2026-10-13",
    title: "Claim submitted",
    actor: "Customer",
    explanation: "A reimbursement claim and initial documents were submitted.",
    uncertainty: "Receipt does not establish insurer acceptance or coverage.",
    next: "Wait for acknowledgement and review any requests.",
    state: initialState,
    sources: [source("claim", "Claim form")],
    documentIds: ["claim", "bill", "policy"],
  },
  {
    id: "e2",
    date: "2026-10-14T09:00:00",
    title: "Under review",
    actor: "Insurer",
    explanation:
      "The insurer acknowledged the claim and began reviewing the supplied material.",
    uncertainty: "No coverage or settlement decision has been reported.",
    next: "Check the insurer communication.",
    state: { processing: "Under review" },
    sources: [source("acknowledgement", "Insurer acknowledgement")],
    documentIds: ["claim", "bill", "policy", "acknowledgement"],
  },
  {
    id: "e3",
    date: "2026-10-14T15:00:00",
    title: "More information requested",
    actor: "Insurer",
    explanation:
      "The insurer requested the discharge summary and proof of renewal payment.",
    uncertainty:
      "Renewal continuity cannot be verified from the current policy alone.",
    next: "Supply the requested records and preserve their receipt.",
    state: {
      processing: "Awaiting information",
      evidence: "Additional documents requested",
    },
    sources: [source("request", "Information request")],
    documentIds: ["claim", "bill", "policy", "request"],
  },
  {
    id: "e4",
    date: "2026-10-16",
    title: "Document received",
    actor: "Insurer",
    explanation:
      "The insurer confirmed receipt of the discharge summary. Renewal payment evidence is still missing.",
    uncertainty:
      "Receipt does not establish that all requested evidence has been accepted.",
    next: "Compare the dates and find the renewal receipt.",
    state: { evidence: "Clarification required" },
    sources: [source("receipt", "Document receipt")],
    documentIds: ["claim", "bill", "policy", "request", "discharge", "receipt"],
  },
  {
    id: "e5",
    date: "2026-10-17",
    title: "Back under review",
    actor: "Insurer",
    explanation:
      "The requested document was received. Processing returned to review; this is a new event, not a reversal of history.",
    uncertainty:
      "The hospital bill and discharge summary still disagree. Coverage continuity remains unresolved.",
    next: "Verify the discharge date with the hospital.",
    state: { processing: "Under review" },
    sources: [source("receipt", "Insurer update")],
    documentIds: ["claim", "bill", "policy", "request", "discharge", "receipt"],
  },
  {
    id: "e6",
    date: "2026-10-18",
    title: "Additional review",
    actor: "Insurer",
    explanation:
      "The communication reports a referral for manual verification. It does not establish wrongdoing.",
    uncertainty:
      "The underlying routing-model reasons were not supplied. ClaimMe cannot infer them.",
    next: "Keep the requested evidence available.",
    state: { risk: "Manual review", processing: "Additional review" },
    sources: [source("review", "Review notification")],
    documentIds: [
      "claim",
      "bill",
      "policy",
      "request",
      "discharge",
      "receipt",
      "review",
    ],
  },
  {
    id: "e7",
    date: "2026-10-22",
    title: "Assessment completed",
    actor: "Insurer",
    explanation:
      "The insurer reported that its assessment was complete. This event does not itself confirm payment.",
    uncertainty:
      "The detailed calculation will be available in the settlement letter.",
    next: "Review the settlement letter when received.",
    state: { processing: "Assessment completed", risk: "Review completed" },
    sources: [source("assessment", "Assessment notice")],
    documentIds: [
      "claim",
      "bill",
      "policy",
      "request",
      "discharge",
      "receipt",
      "review",
      "assessment",
    ],
  },
  {
    id: "e8",
    date: "2026-10-24",
    title: "Settlement recorded",
    actor: "Insurer",
    explanation:
      "An illustrative settlement letter records ₹76,500 after ₹23,500 in deductions.",
    uncertainty:
      "A settlement amount does not confirm bank payment. The date mismatch and renewal evidence remain open.",
    next: "Inspect deductions and prepare questions supported by evidence.",
    state: {
      processing: "Settlement recorded",
      settlement: "Partial settlement recorded",
    },
    sources: [source("settlement", "Settlement letter")],
    documentIds: [
      "claim",
      "bill",
      "policy",
      "request",
      "discharge",
      "receipt",
      "review",
      "assessment",
      "settlement",
    ],
  },
];
export const events: ClaimEvent[] = eventLog.map((event, index) => ({
  ...event,
  documentIds: Array.from(
    new Set(eventLog.slice(0, index + 1).flatMap((e) => e.documentIds)),
  ),
}));
export const documents: EvidenceDocument[] = [
  {
    id: "bill",
    title: "Hospital bill",
    kind: "Financial record",
    received: "2026-10-13",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "City Care Hospital · Final bill\nPatient: Aarav Sharma\nAdmission: 09 October 2026\nDischarge: 12 October 2026\nTotal billed: ₹1,00,000",
    fields: [
      {
        id: "bill-date",
        label: "Discharge date",
        value: "2026-10-12",
        confidence: "Needs verification",
        source: source("bill", "Hospital bill"),
      },
    ],
  },
  {
    id: "discharge",
    title: "Discharge summary",
    kind: "Clinical record",
    received: "2026-10-16",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "City Care Hospital · Discharge summary\nPatient: Aarav Sharma\nAdmission: 09 October 2026\nDischarge: 13 October 2026\nFollow-up advised as recorded by the hospital.",
    fields: [
      {
        id: "discharge-date",
        label: "Discharge date",
        value: "2026-10-13",
        confidence: "Needs verification",
        source: source("discharge", "Discharge summary"),
      },
    ],
  },
  {
    id: "policy",
    title: "Health policy",
    kind: "Policy wording",
    received: "2026-10-13",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "Example Health Policy · EH-2026\nPeriod: 01 Oct 2026 — 30 Sep 2027\nClause 4.2: 10% co-pay on the admissible amount after applicable adjustments.\nClause 4.3: Room-related adjustment subject to the stated sub-limit.\nContinuity must be verified against renewal records.",
    fields: [],
  },
  {
    id: "claim",
    title: "Claim form",
    kind: "Customer submission",
    received: "2026-10-13",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "Reimbursement claim CM-1024\nCustomer: Aarav Sharma\nHospital: City Care Hospital\nClaimed amount: ₹1,00,000\nSubmitted: 13 October 2026",
    fields: [],
  },
  {
    id: "request",
    title: "Information request",
    kind: "Insurer communication",
    received: "2026-10-14",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "Please provide the discharge summary and renewal payment receipt for assessment of your claim. Initial claim documents have been acknowledged. No decision on coverage is stated.",
    fields: [],
  },
  {
    id: "receipt",
    title: "Document receipt",
    kind: "Insurer communication",
    received: "2026-10-16",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "We confirm receipt of the discharge summary on 16 October 2026. Additional documents received. Under process. Review resumed on 17 October 2026.",
    fields: [],
  },
  {
    id: "review",
    title: "Review notification",
    kind: "Insurer communication",
    received: "2026-10-18",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "The claim has been routed for manual verification. The routing reasons are not included in this communication.",
    fields: [],
  },
  {
    id: "assessment",
    title: "Assessment notice",
    kind: "Insurer communication",
    received: "2026-10-22",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "Our assessment of claim CM-1024 is complete. Please refer to the settlement letter for the amount and deduction details.",
    fields: [],
  },
  {
    id: "settlement",
    title: "Settlement letter",
    kind: "Insurer decision",
    received: "2026-10-24",
    readable: true,
    parsed: true,
    verified: false,
    insurerAccepted: false,
    excerpt:
      "Illustrative settlement CM-1024\nHospital bill ₹1,00,000\nNon-payable items ₹5,000\nSub-limit adjustment ₹10,000\nAdmissible base ₹85,000\nCo-pay 10% ₹8,500\nSettlement ₹76,500\nBank payment confirmation not supplied.",
    fields: [],
  },
];
documents.push({
  id: "acknowledgement",
  title: "Claim acknowledgement",
  kind: "Insurer communication",
  received: "2026-10-14T09:00:00",
  readable: true,
  parsed: true,
  verified: false,
  insurerAccepted: false,
  excerpt:
    "We acknowledge receipt of claim CM-1024. Initial document review has started. No coverage or settlement decision is recorded.",
  fields: [],
});
export const conflicts: EvidenceConflict[] = [
  {
    id: "date",
    title: "One date. Two sources.",
    fields: ["bill-date", "discharge-date"],
    documentIds: ["bill", "discharge"],
    explanation:
      "The bill shows 12 October; the discharge summary shows 13 October. This could be a billing convention or clerical error. ClaimMe cannot establish which is correct.",
  },
];
export const clauses: PolicyClause[] = [
  {
    id: "copay",
    title: "Co-pay · Clause 4.2",
    wording:
      "The insured bears 10% of the admissible claim amount after applicable non-payable and sub-limit adjustments.",
    explanation:
      "In this synthetic policy, the 10% share is calculated on ₹85,000, not the original bill.",
    effect: "Illustrative co-pay: ₹8,500.",
    source: source("policy", "Example policy · clause 4.2", 4),
  },
  {
    id: "sublimit",
    title: "Sub-limit · Clause 4.3",
    wording:
      "Room-related expenses are subject to the limit recorded in the policy schedule. Adjustments must be itemized in the assessment.",
    explanation:
      "A cap may affect specific expenses. The example settlement records ₹10,000, but the supporting room schedule is missing.",
    effect: "Ask for the schedule and line-item calculation.",
    source: source("policy", "Example policy · clause 4.3", 4),
  },
  {
    id: "continuity",
    title: "Renewal continuity · Clause 2.1",
    wording:
      "Continuity is assessed with reference to the applicable periods, premium payment record, and endorsements.",
    explanation:
      "The previous policy expired on 28 September. The current period starts on 1 October. Payment and endorsements are not supplied.",
    effect:
      "Continuity cannot yet be verified. No coverage-loss conclusion is established.",
    source: source("policy", "Example policy · clause 2.1", 2),
  },
];
export const messages: Message[] = [
  {
    id: "m1",
    date: "2026-10-14",
    actor: "Insurer",
    category: "Action required",
    original: documents[4].excerpt,
    explanation:
      "Two records were requested. The summary has since arrived; renewal payment evidence remains missing.",
    source: source("request", "Information request"),
    action: "renewal",
  },
  {
    id: "m2",
    date: "2026-10-16",
    actor: "Insurer",
    category: "Information",
    original: documents[5].excerpt,
    explanation:
      "Receipt and resumed review are recorded. They do not establish coverage or approval.",
    source: source("receipt", "Document receipt"),
  },
  {
    id: "m3",
    date: "2026-10-18",
    actor: "Insurer",
    category: "Clarification",
    original: documents[6].excerpt,
    explanation:
      "Additional review is a verification step, not an accusation. Routing reasons are unavailable.",
    source: source("review", "Review notification"),
  },
  {
    id: "m4",
    date: "2026-10-24",
    actor: "Insurer",
    category: "Settlement",
    original: documents[8].excerpt,
    explanation:
      "Review the deductions and compare each one with the policy and calculation.",
    source: source("settlement", "Settlement letter"),
  },
];
export const actions: ActionItem[] = [
  {
    id: "date",
    title: "Review the discharge date",
    why: "Two source documents disagree by one day.",
    href: "/app/claims/CM-1024/evidence?compare=1",
  },
  {
    id: "renewal",
    title: "Find the renewal payment receipt",
    why: "Policy continuity cannot be verified from the available material.",
    href: "/app/policies/EH-2026",
  },
  {
    id: "deduction",
    title: "Understand the ₹23,500 deductions",
    why: "One adjustment still needs a supporting room schedule.",
    href: "/app/claims/CM-1024/settlement",
  },
];
export const glossary = [
  [
    "Co-pay",
    "The share of an admissible claim you bear under your policy. The calculation base depends on the wording.",
  ],
  [
    "Sub-limit",
    "A cap on a particular benefit or expense. Ask which clause and expense the cap affects.",
  ],
  [
    "Deductible",
    "An amount you bear before eligible policy benefits apply, subject to your contract.",
  ],
  [
    "Cashless",
    "An arrangement in which the insurer pays an eligible amount directly to a network hospital. It does not necessarily cover the whole bill.",
  ],
  [
    "Reimbursement",
    "You pay first and submit evidence to request repayment under the policy.",
  ],
  [
    "TPA",
    "A third-party administrator that helps administer services and claims for an insurer.",
  ],
  [
    "Waiting period",
    "A period during which specified benefits may not apply. Use the applicable policy version.",
  ],
  [
    "Continuity",
    "The relationship between coverage periods and renewal records. A missing receipt leaves a question, not a coverage decision.",
  ],
  [
    "Additional review",
    "A request for more verification. It is not itself a finding of wrongdoing.",
  ],
  [
    "Settlement",
    "The amount recorded in an insurer decision. Payment confirmation is a separate event.",
  ],
  [
    "Grievance",
    "A formal complaint supported by the relevant communications and evidence.",
  ],
  [
    "Ombudsman",
    "An insurance grievance redressal mechanism with applicable eligibility and procedure requirements. Verify current official guidance.",
  ],
];
