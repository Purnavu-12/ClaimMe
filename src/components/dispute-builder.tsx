"use client";
import { useState } from "react";
import { DownloadSimple, ArrowRight } from "@phosphor-icons/react";
import { useDemo, downloadJson } from "./demo-provider";
import { buildGrievance } from "@/domain/engine";
import { Badge, Field, SourceLink } from "./ui";
export function DisputeBuilder() {
  const { state, update } = useDemo();
  const [preview, setPreview] = useState(false);
  const [feedback, setFeedback] = useState("");
  return (
    <>
      <div className="split readiness">
        <section className="tinted">
          <Badge tone="success">Available evidence</Badge>
          <h3>Start with what the documents show.</h3>
          <ul>
            <li>Different discharge dates in two records.</li>
            <li>₹10,000 sub-limit deduction recorded in the letter.</li>
            <li>Review requests and receipt history.</li>
          </ul>
          <SourceLink
            source={{
              documentId: "settlement",
              label: "Settlement letter",
              page: 1,
            }}
          />
        </section>
        <section className="tinted">
          <Badge tone="warning">Missing / unsupported</Badge>
          <h3>Keep the open questions visible.</h3>
          <ul>
            <li>Renewal payment receipt and room schedule are missing.</li>
            <li>Bank payment is not confirmed.</li>
            <li>
              Coverage entitlement and insurer misconduct are not established.
            </li>
          </ul>
        </section>
      </div>
      <section className="workspace-section">
        <p className="eyebrow section-label">Build a supported draft</p>
        <h2>What would you like clarified?</h2>
        <div className="choice-list">
          {[
            [
              "date",
              "Please verify the discharge date.",
              "Supported by the hospital bill and discharge summary.",
            ],
            [
              "sublimit",
              "Please explain the room-related adjustment.",
              "Supported by the settlement letter and example policy clause.",
            ],
          ].map(([id, title, detail]) => (
            <label className="choice" key={id}>
              <input
                type="checkbox"
                checked={state.dispute.assertions.includes(id)}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    dispute: {
                      ...s.dispute,
                      assertions: e.target.checked
                        ? [...s.dispute.assertions, id]
                        : s.dispute.assertions.filter((v) => v !== id),
                    },
                  }))
                }
              />
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </label>
          ))}
        </div>
        <Field label="Your statement (unverified customer account)">
          <textarea
            placeholder="Describe what you would like the insurer to clarify. Use synthetic information only."
            maxLength={3000}
            value={state.dispute.statement}
            onChange={(e) =>
              update((s) => ({
                ...s,
                dispute: { ...s.dispute, statement: e.target.value },
              }))
            }
          />
        </Field>
        <p className="fine">
          Your statement is kept separate from documentary facts. Unsupported
          assertions are not converted into established evidence.
        </p>
        <div className="inline">
          <button
            className="button secondary"
            disabled={!state.dispute.assertions.length}
            onClick={() => setPreview(!preview)}
          >
            Review draft
            <ArrowRight size={16} />
          </button>
          <button
            className="button"
            disabled={!state.dispute.assertions.length}
            onClick={() => {
              downloadJson(
                "claimme-CM-1024-draft-grievance.json",
                buildGrievance(state),
              );
              update((s) => ({
                ...s,
                audit: [
                  ...s.audit,
                  {
                    id: crypto.randomUUID(),
                    at: new Date().toISOString(),
                    actor: "Demo customer",
                    kind: "draft",
                    description:
                      "Exported a synthetic draft grievance pack. Nothing submitted externally.",
                  },
                ],
              }));
              setFeedback(
                "Draft pack downloaded. It contains references and excerpts, not original document attachments. Nothing was submitted.",
              );
            }}
          >
            <DownloadSimple size={18} />
            Export draft pack
          </button>
        </div>
        {feedback && (
          <p className="notice" role="status">
            {feedback}
          </p>
        )}
        {preview && (
          <article className="draft-preview">
            <Badge tone="orange">Draft · not submitted</Badge>
            <h3>Request for clarification · CM-1024</h3>
            {buildGrievance(state).issues.map((i) => (
              <p key={i.question}>
                {i.question}
                <small className="block">Sources: {i.sources.join(", ")}</small>
              </p>
            ))}
            {state.dispute.statement && (
              <>
                <h4>Customer statement · unverified</h4>
                <p>{state.dispute.statement}</p>
              </>
            )}
            <p className="fine">
              Missing evidence: renewal receipt, room schedule, payment
              confirmation. External grievance eligibility has not been
              determined.
            </p>
          </article>
        )}
      </section>
    </>
  );
}
