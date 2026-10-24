export type Source = { documentId: string; page: number; label: string };
export type ClaimState = {
  processing: string;
  evidence: string;
  coverage: string;
  risk: string;
  settlement: string;
  dispute: string;
};
export type Claim = {
  id: string;
  insurer: string;
  hospital: string;
  patient: string;
  type: "Reimbursement" | "Cashless";
  amount: number;
  status: "Needs attention" | "Settled" | "Closed";
  state: ClaimState;
  summary: string;
  date: string;
};
export type ClaimEvent = {
  id: string;
  date: string;
  title: string;
  actor: string;
  explanation: string;
  uncertainty: string;
  next: string;
  state: Partial<ClaimState>;
  sources: Source[];
  documentIds: string[];
};
export type ExtractedField = {
  id: string;
  label: string;
  value: string;
  confidence: "Directly stated" | "Needs verification";
  source: Source;
};
export type EvidenceDocument = {
  id: string;
  title: string;
  kind: string;
  received: string;
  readable: boolean;
  parsed: boolean;
  verified: boolean;
  insurerAccepted: boolean;
  fields: ExtractedField[];
  excerpt: string;
};
export type EvidenceConflict = {
  id: string;
  title: string;
  fields: string[];
  documentIds: string[];
  explanation: string;
};
export type PolicyClause = {
  id: string;
  title: string;
  wording: string;
  explanation: string;
  effect: string;
  source: Source;
};
export type SettlementLine = {
  id: string;
  label: string;
  amount: number;
  base: number;
  formula: string;
  explanation: string;
  source: Source;
  policy?: string;
};
export type Message = {
  id: string;
  date: string;
  actor: string;
  category: string;
  original: string;
  explanation: string;
  source: Source;
  action?: string;
};
export type ActionItem = {
  id: string;
  title: string;
  why: string;
  href: string;
};
export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  kind: "correction" | "consent" | "action" | "draft";
  description: string;
  fieldId?: string;
  previous?: string;
  value?: string;
  reason?: string;
};
export type Consent = { localDemo: boolean; at: string | null };
export type Dispute = { statement: string; assertions: string[] };
export type DemoState = {
  version: 2;
  corrections: Record<string, string>;
  completedActions: string[];
  audit: AuditEntry[];
  dispute: Dispute;
  consent: Consent;
  preferences: { name: string; notifications: boolean };
  onboarding: { intent: string; hasClaim: string };
};
