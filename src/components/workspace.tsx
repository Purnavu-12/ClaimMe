"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  MagnifyingGlass,
  FileText,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";
import { actions, claims, events, glossary } from "@/domain/fixtures";
import { money } from "@/domain/engine";
import { useDemo } from "./demo-provider";
import {
  Badge,
  ButtonLink,
  Disclosure,
  EmptyState,
  PageHeading,
  SourceLink,
} from "./ui";
import { ClaimWorkspace } from "./claim-workspace";
import { DocumentsView, NewClaim } from "./documents-view";
import { PolicyView } from "./policy-view";
import { Settings } from "./settings";
export function Workspace({ segments }: { segments: string[] }) {
  const [root, id, tab] = segments;
  if (root === "claims" && id === "new") return <NewClaim />;
  if (root === "claims" && id)
    return <ClaimWorkspace claimId={id} tab={tab ?? "overview"} />;
  if (root === "claims") return <ClaimsView />;
  if (root === "documents") return <DocumentsView />;
  if (root === "policies") return <PolicyView detail={!!id} />;
  if (root === "settings")
    return <Settings key={id ?? "profile"} tab={id ?? "profile"} />;
  if (root === "help") return <Help />;
  if (root === "actions") return <Actions />;
  if (root === "insights") return <Insights />;
  if (root === "disputes") return <Disputes />;
  return <Home />;
}
function Home() {
  const { state } = useDemo();
  const remaining = actions.filter(
    (a) => !state.completedActions.includes(a.id),
  );
  return (
    <>
      <PageHeading
        eyebrow="A little clarity, every step."
        title={`Good morning, ${state.preferences.name}.`}
        description={
          remaining.length
            ? `One claim has ${remaining.length} next steps to explore.`
            : "You’ve reviewed your current action list. Unresolved evidence may still need verification."
        }
        action={
          <ButtonLink href="/app/claims/new">
            <Plus size={17} />
            Add a claim
          </ButtonLink>
        }
      />
      <div className="home-layout">
        <div>
          <section className="active-claim">
            <div className="section-top">
              <span className="eyebrow">Your active claim</span>
              <Badge tone="warning">Needs attention</Badge>
            </div>
            <div className="claim-identity">
              <div className="insurer-mark">
                <FileText size={24} />
              </div>
              <div>
                <strong>City Care Hospital</strong>
                <p className="fine">CM-1024 · Reimbursement · 09–13 Oct 2026</p>
              </div>
              <span className="claim-amount">
                ₹1,00,000<small>submitted amount</small>
              </span>
            </div>
            <h2>
              Your settlement is here.
              <br />
              Let’s understand it together.
            </h2>
            <p>
              The letter records ₹76,500. Two document dates disagree, and the
              room adjustment needs supporting evidence.
            </p>
            <div className="claim-mini-timeline">
              <span>Submitted</span>
              <span>Reviewed</span>
              <span className="current">Settlement recorded</span>
            </div>
            <ButtonLink href="/app/claims/CM-1024">
              Open claim workspace
            </ButtonLink>
            <SourceLink
              source={{
                documentId: "settlement",
                label: "Settlement letter",
                page: 1,
              }}
            />
          </section>
          <section className="workspace-section">
            <div className="section-top">
              <h2>What happened recently</h2>
              <Link className="text-link" href="/app/claims/CM-1024/journey">
                Full journey
                <ArrowUpRight size={15} />
              </Link>
            </div>
            {events
              .slice(-3)
              .reverse()
              .map((e) => (
                <Link
                  className="activity-row"
                  key={e.id}
                  href="/app/claims/CM-1024/journey"
                >
                  <Clock size={18} />
                  <div>
                    <strong>{e.title}</strong>
                    <p>{e.explanation}</p>
                  </div>
                  <time>
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </time>
                </Link>
              ))}
          </section>
        </div>
        <aside>
          <section className="action-panel">
            <p className="eyebrow section-label">Your next steps</p>
            <h2>A clearer way forward.</h2>
            {remaining.length ? (
              remaining.map((a, i) => (
                <Link className="action-row" href={a.href} key={a.id}>
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <strong>{a.title}</strong>
                    <p>{a.why}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))
            ) : (
              <p>
                All demo actions marked reviewed. You can revisit them from
                Actions.
              </p>
            )}
            <Link className="text-link" href="/app/actions">
              Review all actions
              <ArrowRight size={15} />
            </Link>
          </section>
          <section className="policy-note">
            <Badge tone="warning">Needs verification</Badge>
            <h3>A renewal question remains.</h3>
            <p>
              The previous and current policy periods don’t meet. A payment
              receipt may help explain the dates.
            </p>
            <Link className="text-link" href="/app/policies/EH-2026">
              Explore policy continuity
              <ArrowRight size={16} />
            </Link>
          </section>
          <div className="quiet-note">
            <CheckCircle size={20} />
            <p>
              This workspace uses synthetic evidence. Your demo changes stay in
              this browser.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
function ClaimsView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const visible = claims.filter(
    (c) =>
      (filter === "All" || c.status === filter) &&
      `${c.id} ${c.hospital} ${c.insurer}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="Every claim has a story"
        title="Your claims"
        description="Follow the journey. Understand the next step."
        action={
          <ButtonLink href="/app/claims/new">
            <Plus size={18} />
            Add a claim
          </ButtonLink>
        }
      />
      <div className="toolbar">
        <div className="tabs" role="group" aria-label="Claim status">
          {["All", "Needs attention", "Settled", "Closed"].map((t) => (
            <button
              key={t}
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="search">
          <MagnifyingGlass size={18} />
          <input
            aria-label="Search claims"
            placeholder="Search claims…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="claims-list">
        {visible.map((c) => (
          <Link
            href={`/app/claims/${c.id}`}
            key={c.id}
            className="claim-list-row"
          >
            <span className="insurer-mark">
              <FileText size={25} />
            </span>
            <div>
              <div className="inline">
                <h2>{c.hospital}</h2>
                <Badge
                  tone={
                    c.status === "Needs attention"
                      ? "warning"
                      : c.status === "Settled"
                        ? "success"
                        : "neutral"
                  }
                >
                  {c.status}
                </Badge>
              </div>
              <p>
                {c.id} · {c.type} · {c.insurer}
              </p>
              <p className="fine">{c.summary}</p>
            </div>
            <strong>{money(c.amount)}</strong>
            <ArrowUpRight size={21} />
          </Link>
        ))}
      </div>
      {!visible.length && (
        <EmptyState
          title="No claims match"
          description="Try another search or status filter."
        />
      )}
    </>
  );
}
function Actions() {
  const { state, update } = useDemo();
  return (
    <>
      <PageHeading
        eyebrow="Understand → Act"
        title="Your next steps"
        description="Review what needs attention. Marking an item reviewed does not resolve the underlying evidence."
      />
      {actions.map((a) => {
        const done = state.completedActions.includes(a.id);
        return (
          <div className="action-full-row" key={a.id}>
            <div>
              <Badge tone={done ? "success" : "warning"}>
                {done ? "Reviewed" : "Needs attention"}
              </Badge>
              <h2>{a.title}</h2>
              <p>{a.why}</p>
              <Link className="text-link" href={a.href}>
                Open supporting context
                <ArrowRight size={16} />
              </Link>
            </div>
            <button
              className="button secondary small"
              onClick={() =>
                update((s) => ({
                  ...s,
                  completedActions: done
                    ? s.completedActions.filter((id) => id !== a.id)
                    : [...s.completedActions, a.id],
                  audit: [
                    ...s.audit,
                    {
                      id: crypto.randomUUID(),
                      at: new Date().toISOString(),
                      actor: "Demo customer",
                      kind: "action",
                      description: `${a.title}: ${done ? "reopened" : "marked reviewed"}. Evidence status unchanged.`,
                    },
                  ],
                }))
              }
            >
              {done ? "Reopen action" : "Mark reviewed"}
            </button>
          </div>
        );
      })}
    </>
  );
}
function Help() {
  const [q, setQ] = useState("");
  const filtered = glossary.filter(([term, def]) =>
    `${term} ${def}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="A little less insurance-speak"
        title="Here to make things clearer."
        description="Plain-language explanations. Your policy wording always matters."
      />
      <label className="search wide">
        <MagnifyingGlass size={20} />
        <input
          aria-label="Search insurance terms"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try co-pay, continuity, or settlement…"
        />
      </label>
      <div className="glossary">
        {filtered.map(([term, def]) => (
          <Disclosure key={term} title={term}>
            <p>{def}</p>
            <p className="fine">
              General explanation. For claim-specific meaning, inspect your
              applicable policy and evidence.
            </p>
          </Disclosure>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="That term isn’t in this glossary yet"
          description="Try a shorter phrase. ClaimMe won’t invent a definition or an answer."
        />
      )}
      <div className="tinted">
        <h3>Looking for a grievance route?</h3>
        <p>
          Check the current requirements with the official source. ClaimMe’s
          demo does not determine eligibility.
        </p>
        <a
          href="https://bimabharosa.irdai.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Bima Bharosa
          <ArrowUpRight size={16} />
        </a>
        <a
          href="https://www.cioins.co.in/FAQ_Online"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Insurance Ombudsman guidance
          <ArrowUpRight size={16} />
        </a>
      </div>
    </>
  );
}
function Insights() {
  return (
    <>
      <PageHeading
        eyebrow="A clearer picture"
        title="What your evidence tells us"
        description="Findings about this illustrative claim—not predictions of approval."
      />
      {[
        {
          label: "Possible inconsistency",
          title: "Two documents disagree by one day.",
          text: "Compare the hospital bill with the discharge summary. A mismatch alone establishes neither fraud nor a coverage outcome.",
          href: "/app/claims/CM-1024/evidence?compare=1",
        },
        {
          label: "Missing evidence",
          title: "Renewal continuity is unresolved.",
          text: "Payment evidence and endorsements are absent. A current policy document does not independently prove continuity.",
          href: "/app/policies/EH-2026",
        },
        {
          label: "Insurer decision",
          title: "₹76,500 is recorded in the settlement letter.",
          text: "The example arithmetic reconciles. The room schedule and bank payment confirmation are still missing.",
          href: "/app/claims/CM-1024/settlement",
        },
      ].map((i) => (
        <section className="finding" key={i.title}>
          <Badge tone="orange">{i.label}</Badge>
          <h2>{i.title}</h2>
          <p>{i.text}</p>
          <Link className="text-link" href={i.href}>
            Inspect the evidence
            <ArrowRight size={16} />
          </Link>
        </section>
      ))}
    </>
  );
}
function Disputes() {
  const { state } = useDemo();
  return (
    <>
      <PageHeading
        eyebrow="Facts first"
        title="Questions worth asking"
        description="Prepare a supported grievance. Keep missing evidence and customer statements visible."
      />
      <section className="active-claim">
        <Badge tone={state.dispute.assertions.length ? "orange" : "neutral"}>
          {state.dispute.assertions.length
            ? "Draft in progress"
            : "Ready to explore"}
        </Badge>
        <h2>CM-1024 · Settlement questions</h2>
        <p>
          Review the date mismatch and request the calculation behind the room
          adjustment.
        </p>
        <ButtonLink href="/app/claims/CM-1024/dispute">
          Open grievance workspace
        </ButtonLink>
      </section>
    </>
  );
}
