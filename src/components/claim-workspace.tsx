"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, FileText } from "@phosphor-icons/react";
import { claims, events, messages } from "@/domain/fixtures";
import { money } from "@/domain/engine";
import { useDemo } from "./demo-provider";
import { Badge, ButtonLink, EmptyState, PageHeading, SourceLink } from "./ui";
import { ClaimReplay } from "./claim-replay";
import { DocumentsView } from "./documents-view";
import { PolicyView } from "./policy-view";
import { Settlement } from "./settlement";
import { DisputeBuilder } from "./dispute-builder";
export function ClaimWorkspace({
  claimId,
  tab,
}: {
  claimId: string;
  tab: string;
}) {
  const { state } = useDemo();
  const [messageFilter, setMessageFilter] = useState("All");
  const claim = claims.find((c) => c.id === claimId)!;
  if (claimId !== "CM-1024")
    return (
      <>
        <PageHeading
          eyebrow={`${claim.id} · ${claim.type}`}
          title={claim.hospital}
          description={claim.summary}
        />
        <section className="active-claim">
          <Badge tone={claim.status === "Settled" ? "success" : "neutral"}>
            {claim.status}
          </Badge>
          <h2>{money(claim.amount)}</h2>
          <p>
            This synthetic summary has no detailed evidence pack attached.
            ClaimMe cannot invent documents, calculations or history for it.
          </p>
          <ButtonLink href="/app/claims/CM-1024">
            Explore the documented example
          </ButtonLink>
        </section>
        <EmptyState
          title="No detailed records supplied"
          description="Open CM-1024 to explore the complete synthetic claim journey."
        />
      </>
    );
  if (tab === "evidence") return <DocumentsView claim />;
  if (tab === "policy") return <PolicyView detail />;
  if (tab === "journey")
    return (
      <>
        <PageHeading
          eyebrow="CM-1024 · Claim Replay"
          title="Every change has a context."
          description="Travel through the claim. See only what was known at each point."
        />
        <ClaimReplay />
      </>
    );
  if (tab === "settlement")
    return (
      <>
        <PageHeading
          eyebrow="CM-1024 · Insurer decision"
          title="Your settlement, line by line."
          description="₹76,500 recorded. ₹23,500 deducted. Select an adjustment to inspect its source."
        />
        <div className="notice">
          <Badge>Illustrative calculation</Badge>
          <p>
            The arithmetic reconciles, but the room schedule and bank payment
            confirmation are not supplied.
          </p>
        </div>
        <Settlement />
      </>
    );
  if (tab === "dispute")
    return (
      <>
        <PageHeading
          eyebrow="CM-1024 · Grievance workspace"
          title="A stronger question starts with facts."
          description="Review readiness, choose supported questions, and export a draft for your own review."
        />
        <DisputeBuilder />
      </>
    );
  if (tab === "messages")
    return (
      <>
        <PageHeading
          eyebrow="CM-1024 · Communications"
          title="The message. And what it means."
          description="Original wording stays intact. Explanations point back to the source."
        />
        <div className="tabs" role="group" aria-label="Message category">
          {[
            "All",
            "Action required",
            "Information",
            "Clarification",
            "Settlement",
          ].map((t) => (
            <button
              key={t}
              aria-pressed={t === messageFilter}
              onClick={() => setMessageFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {messages
          .filter(
            (m) => messageFilter === "All" || m.category === messageFilter,
          )
          .map((m) => (
            <article className="message" key={m.id}>
              <div className="section-top">
                <span className="inline">
                  <Badge
                    tone={
                      m.category === "Action required" ? "warning" : "neutral"
                    }
                  >
                    {m.category}
                  </Badge>
                  <strong>{m.actor}</strong>
                </span>
                <time className="fine">{m.date}</time>
              </div>
              <div className="split">
                <section>
                  <p className="eyebrow">Original communication</p>
                  <blockquote>{m.original}</blockquote>
                </section>
                <section>
                  <p className="eyebrow">Plain-language explanation</p>
                  <p>{m.explanation}</p>
                  <SourceLink source={m.source} />
                  {m.action && (
                    <Link href="/app/actions" className="text-link">
                      Review related action
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </section>
              </div>
            </article>
          ))}
      </>
    );
  if (tab === "activity")
    return (
      <>
        <PageHeading
          eyebrow="CM-1024 · Audit trail"
          title="A history you can follow."
          description="Original events are retained. Corrections and customer actions append new entries."
        />
        {[...state.audit].reverse().map((a) => (
          <article key={a.id} className="activity-row">
            <Clock size={19} />
            <div>
              <strong>{a.description}</strong>
              <p>
                {a.actor} · {a.kind} · {new Date(a.at).toLocaleString("en-IN")}
              </p>
              {a.reason && <p>Reason: {a.reason}</p>}
            </div>
          </article>
        ))}
        {[...events].reverse().map((e) => (
          <article key={e.id} className="activity-row">
            <FileText size={19} />
            <div>
              <strong>{e.title}</strong>
              <p>
                {e.actor} · {e.date}
              </p>
              <p>{e.explanation}</p>
            </div>
          </article>
        ))}
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="CM-1024 · Reimbursement"
        title="A clearer picture of your claim."
        description="City Care Hospital · Example Health Insurance · Submitted ₹1,00,000"
        action={
          <ButtonLink href="/app/claims/CM-1024/journey" secondary>
            Replay the journey
          </ButtonLink>
        }
      />
      <div className="overview-layout">
        <div>
          <section className="active-claim">
            <Badge tone="orange">Insurer decision recorded</Badge>
            <h2>
              Your settlement is recorded.
              <br />
              Some questions remain open.
            </h2>
            <p>
              The insurer’s illustrative letter records ₹76,500 after
              deductions. This does not confirm that a bank payment has arrived.
            </p>
            <SourceLink
              source={{
                documentId: "settlement",
                label: "Settlement letter",
                page: 1,
              }}
            />
            <div className="overview-summary">
              <div>
                <span>Hospital bill</span>
                <strong>₹1,00,000</strong>
              </div>
              <div>
                <span>Deductions</span>
                <strong>₹23,500</strong>
              </div>
              <div>
                <span>Settlement</span>
                <strong className="accent">₹76,500</strong>
              </div>
            </div>
            <ButtonLink href="/app/claims/CM-1024/settlement">
              Understand the deductions
            </ButtonLink>
          </section>
          <section className="workspace-section">
            <p className="eyebrow section-label">What changed</p>
            <h2>From assessment to a recorded amount.</h2>
            <p>
              On 22 October the assessment was completed. On 24 October the
              insurer supplied its settlement calculation.
            </p>
            <SourceLink
              source={{
                documentId: "assessment",
                label: "Assessment notice",
                page: 1,
              }}
            />
          </section>
          <div className="split">
            <section>
              <h3>What the documents show</h3>
              <ul className="fact-list">
                <li>A ₹1,00,000 bill was submitted.</li>
                <li>The discharge summary was received on 16 October.</li>
                <li>The settlement letter records ₹76,500.</li>
              </ul>
            </section>
            <section>
              <h3>What remains uncertain</h3>
              <ul className="fact-list">
                <li>Discharge date: 12 or 13 October?</li>
                <li>Renewal continuity without payment evidence.</li>
                <li>Room schedule behind the sub-limit.</li>
              </ul>
            </section>
          </div>
        </div>
        <aside>
          <section className="state-panel">
            <p className="eyebrow">Parallel claim states</p>
            <h3>One status isn’t the whole story.</h3>
            {Object.entries(claim.state).map(([k, v]) => (
              <div className="state-row" key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <p className="fine">
              Evidence uncertainty can coexist with an insurer’s settlement
              decision.
            </p>
          </section>
          <section className="policy-note">
            <Badge tone="warning">Next useful step</Badge>
            <h3>Compare the discharge dates.</h3>
            <p>
              Customer corrections: {Object.keys(state.corrections).length}.
              Original documents remain unchanged.
            </p>
            <Link
              href="/app/claims/CM-1024/evidence?compare=1"
              className="text-link"
            >
              Open the evidence
              <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
