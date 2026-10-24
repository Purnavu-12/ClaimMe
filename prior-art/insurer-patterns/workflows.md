# Public claim workflow comparison

Reviewed: 2026-10-24. Publication/version dates are unspecified unless noted. All observations concern public documentation, not authenticated app behavior. Do not generalize an insurer's terms to other policies.

| Source | Observed workflow | Reusable pattern | ClaimMe design response |
| --- | --- | --- | --- |
| [HDFC ERGO reimbursement](https://www.hdfcergo.com/claim/register-health-insurance-claim/reimbursement) | Registration and document uploads, review, additional-document requests by SMS/email, tracking, settlement and bank transfer. Page contains a dated April 2023 notification notice. | Requests and uploads are distinct steps; progress is communicated across channels. | Link each request to its message, requested document and receipt event. Do not reuse displayed processing windows as universal deadlines. |
| [ACKO reimbursement help](https://care.acko.com/support/solutions/articles/35000194538-how-can-i-raise-a-reimbursement-claim-request-) | Select policy, start claim, enter hospitalization, photograph documents, submit, track. Email alternative and document checklist are described. | Progressive steps and capture-friendly uploads. | Begin with available evidence and ask for missing details afterward. Show per-file quality feedback and a review step. |
| [Star Health status help](https://www.starhealth.in/help/internal/health-claim-status/) | App login, My Claims, select intimation number, select cashless/reimbursement, view status. | Stable claim identifiers and claim-type context. | Preserve identity and type across every route. Add an evidence-grounded explanation beside the reported status. |
| [Medi Assist reimbursement guide](https://blog.mediassist.in/reimbursement-claims-and-how-to-submit-them-online/) | Intimation, scanned uploads, completeness check, and physical originals in the described process. Tracking supports several identifiers. | Completeness acknowledgement is separate from initial upload. | Track digital receipt and any expressly requested physical originals independently. The article is undated and its physical-document instructions require policy-specific verification. |

## Avoided patterns

Avoid a global upload-complete checkmark that implies insurer acceptance; disconnected requests without the original message; approval-like reassurance unsupported by a decision; and deadlines copied from help pages without a verified effective version.

## Remaining research

Inspect consented public interactive flows/screenshots where accessible, policy wording for the applicable product/version, and public settlement-letter formats. The synthetic arithmetic is an illustration rather than a researched insurer calculation.
