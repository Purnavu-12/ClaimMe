"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FileText,
  MagnifyingGlass,
  ArrowRight,
  UploadSimple,
  CheckCircle,
} from "@phosphor-icons/react";
import { documents } from "@/domain/fixtures";
import { correctField } from "@/domain/engine";
import { useDemo } from "./demo-provider";
import { Badge, EmptyState, Field, PageHeading, SourceLink } from "./ui";
const Graph = dynamic(() => import("./evidence-graph"), {
  ssr: false,
  loading: () => <p role="status">Opening evidence relationships…</p>,
});
export function DocumentsView({ claim = false }: { claim?: boolean }) {
  const params = useSearchParams();
  return <DocumentWorkspace key={params.toString()} claim={claim} />;
}
function DocumentWorkspace({ claim = false }: { claim?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const { state, update } = useDemo();
  const [q, setQ] = useState("");
  const [localId, setLocalId] = useState("bill");
  const [compare, setCompare] = useState(params.get("compare") === "1");
  const [graph, setGraph] = useState(false);
  const [edit, setEdit] = useState("");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const selectedId = params.get("doc") ?? localId;
  const doc = documents.find((d) => d.id === selectedId);
  const visible = documents.filter((d) =>
    `${d.title} ${d.kind}`.toLowerCase().includes(q.toLowerCase()),
  );
  const select = (id: string) => {
    setLocalId(id);
    setFeedback("");
    setEdit("");
    if (params.get("doc"))
      router.replace(
        `${claim ? "/app/claims/CM-1024/evidence" : "/app/documents"}?doc=${id}`,
        { scroll: false },
      );
  };
  const renderDoc = (id: string) => {
    const d = documents.find((doc) => doc.id === id)!;
    return (
      <section className="document-sheet" key={d.id}>
        <div className="sheet-letterhead">
          <FileText size={24} />
          <span>
            ILLUSTRATIVE DOCUMENT
            <br />
            CM-1024 · PAGE 1
          </span>
        </div>
        <h2>{d.title}</h2>
        <pre>{d.excerpt}</pre>
        {d.fields.map((f) => (
          <div className="extracted-field" key={f.id}>
            <span className="fine">Extracted field · {f.label}</span>
            <strong>{state.corrections[f.id] ?? f.value}</strong>
            {state.corrections[f.id] && (
              <Badge tone="orange">
                Customer correction · not source verification
              </Badge>
            )}
            <SourceLink source={f.source} />
            <button
              className="text-link"
              onClick={() => {
                setEdit(f.id);
                setValue(state.corrections[f.id] ?? f.value);
                setReason("");
              }}
            >
              Correct extraction →
            </button>
          </div>
        ))}
        <p className="fine">
          Synthetic record for demonstration. The original excerpt is preserved
          when you correct a field.
        </p>
      </section>
    );
  };
  return (
    <>
      <PageHeading
        eyebrow={claim ? "Claim evidence" : "Your document library"}
        title={
          claim ? "The documents behind the story." : "Everything in one place."
        }
        description="Inspect sources, compare details, and keep uncertainty visible."
        action={
          <Link className="button secondary" href="/app/claims/new">
            <UploadSimple size={18} />
            Preview a document
          </Link>
        }
      />
      <div className="toolbar">
        <label className="search">
          <MagnifyingGlass size={18} />
          <input
            placeholder="Find a document…"
            aria-label="Search documents"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="tabs">
          <button
            aria-pressed={compare}
            onClick={() => {
              setCompare(!compare);
              setGraph(false);
            }}
          >
            Compare sources
          </button>
          <button
            aria-pressed={graph}
            onClick={() => {
              setGraph(!graph);
              setCompare(false);
            }}
          >
            Relationship graph
          </button>
        </div>
      </div>
      <div className="document-layout">
        <aside className="document-list" aria-label="Documents">
          {visible.map((d) => (
            <button
              key={d.id}
              className={d.id === doc?.id ? "selected" : ""}
              onClick={() => select(d.id)}
            >
              <FileText size={21} />
              <span>
                <strong>{d.title}</strong>
                <small>{d.kind}</small>
              </span>
              {state.audit.some(
                (a) => a.fieldId && d.fields.some((f) => f.id === a.fieldId),
              ) && <span className="orange-dot" />}
            </button>
          ))}
          {!visible.length && <p className="muted">No matching documents.</p>}
        </aside>
        <div>
          {graph ? (
            <>
              <Graph onSelect={select} />
              <p className="fine">
                Both documents report the discharge date. The graph does not
                establish which one is correct.
              </p>
              <div className="inline">
                <button
                  className="button secondary small"
                  onClick={() => select("bill")}
                >
                  Hospital bill
                </button>
                <button
                  className="button secondary small"
                  onClick={() => select("discharge")}
                >
                  Discharge summary
                </button>
              </div>
              {doc && renderDoc(doc.id)}
            </>
          ) : compare ? (
            <>
              <div className="notice">
                <Badge tone="warning">Possible inconsistency</Badge>
                <p>
                  The source documents differ by one day. A customer correction
                  does not change either original document or independently
                  resolve the conflict.
                </p>
              </div>
              <div className="compare-documents">
                {renderDoc("bill")}
                {renderDoc("discharge")}
              </div>
            </>
          ) : doc ? (
            <>
              <div className="document-statuses">
                {[
                  ["Received", true],
                  ["Readable", doc.readable],
                  ["Parsed", doc.parsed],
                  ["Verified", doc.verified],
                  ["Insurer accepted", doc.insurerAccepted],
                ].map(([label, yes]) => (
                  <Badge key={String(label)} tone={yes ? "success" : "neutral"}>
                    {String(label)}
                    {yes ? "" : " · not established"}
                  </Badge>
                ))}
              </div>
              {renderDoc(doc.id)}
            </>
          ) : (
            <EmptyState
              title="Source not found"
              description="Choose one of the available illustrative documents."
            />
          )}
          {edit && (
            <form
              className="correction-form tinted"
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  update((s) => correctField(s, edit, value, reason));
                  setEdit("");
                  setFeedback(
                    "Correction saved. Original document preserved; independent verification is still needed.",
                  );
                } catch (err) {
                  setFeedback(
                    err instanceof Error
                      ? err.message
                      : "Correction could not be saved",
                  );
                }
              }}
            >
              <h3>Correct the extracted date</h3>
              <p>
                The original document stays unchanged. Record why you’re making
                this correction.
              </p>
              <Field label="Corrected date">
                <input
                  type="date"
                  value={value}
                  required
                  onChange={(e) => setValue(e.target.value)}
                />
              </Field>
              <Field label="Reason for correction">
                <textarea
                  value={reason}
                  required
                  maxLength={500}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the extraction error…"
                />
              </Field>
              <div className="inline">
                <button className="button" type="submit">
                  Save correction
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => setEdit("")}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {feedback && (
            <p className="notice" role="status">
              {feedback}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
export function NewClaim() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("documents");
  const [files, setFiles] = useState<
    { name: string; type: string; size: number }[]
  >([]);
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState("");
  return (
    <>
      <PageHeading
        eyebrow="Start with what you have"
        title="Bring your claim into focus."
        description="This is a local demonstration. Use synthetic details only. No file content is read, uploaded, or extracted."
      />
      <div className="step-indicator">
        {[
          "Choose a starting point",
          "Review the context",
          "Open your workspace",
        ].map((s, i) => (
          <span className={i === step ? "current" : ""} key={s}>
            0{i + 1} {s}
          </span>
        ))}
      </div>
      <section className="form-panel">
        {step === 0 ? (
          <>
            <h2>What would you like to start with?</h2>
            <div className="choice-list">
              {[
                [
                  "documents",
                  "Existing claim documents",
                  "Preview filenames and types before any future upload.",
                ],
                [
                  "manual",
                  "Enter a claim manually",
                  "Explore the information a workspace needs.",
                ],
                [
                  "message",
                  "An insurer communication",
                  "Bring an update you’d like to understand.",
                ],
              ].map(([id, title, desc]) => (
                <label className="choice" key={id}>
                  <input
                    type="radio"
                    name="method"
                    value={id}
                    checked={method === id}
                    onChange={() => setMethod(id)}
                  />
                  <span>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </span>
                </label>
              ))}
            </div>
            <button className="button" onClick={() => setStep(1)}>
              Continue
              <ArrowRight size={16} />
            </button>
          </>
        ) : step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <h2>
              {method === "documents"
                ? "Preview your synthetic documents"
                : method === "manual"
                  ? "A few essentials"
                  : "What did the insurer say?"}
            </h2>
            {method === "documents" ? (
              <>
                <label className="upload-zone">
                  <UploadSimple size={30} />
                  <strong>Select synthetic files to preview</strong>
                  <span>PDF, PNG or JPEG · up to 10 MB each</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const picked = Array.from(e.target.files ?? []);
                      const allowed = picked.filter(
                        (f) =>
                          [
                            "application/pdf",
                            "image/png",
                            "image/jpeg",
                          ].includes(f.type) && f.size <= 10000000,
                      );
                      setFiles(
                        allowed.map(({ name, type, size }) => ({
                          name,
                          type,
                          size,
                        })),
                      );
                      setFeedback(
                        allowed.length !== picked.length
                          ? "Some files were excluded. Use PDF, PNG or JPEG under 10 MB."
                          : "Metadata preview only. No file content was read.",
                      );
                      e.target.value = "";
                    }}
                  />
                </label>
                {files.map((f) => (
                  <div className="list-row" key={f.name}>
                    <FileText size={20} />
                    <span>{f.name}</span>
                    <small>
                      {Math.ceil(f.size / 1024)} KB · {f.type}
                    </small>
                  </div>
                ))}
                <p role="status" className="fine">
                  {feedback}
                </p>
              </>
            ) : (
              <>
                <Field
                  label={
                    method === "manual"
                      ? "Synthetic hospital name"
                      : "Original message (synthetic only)"
                  }
                >
                  <textarea
                    required
                    value={summary}
                    maxLength={1000}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </Field>
                {method === "manual" && (
                  <Field label="Claim type">
                    <select>
                      <option>Reimbursement</option>
                      <option>Cashless</option>
                    </select>
                  </Field>
                )}
              </>
            )}
            <div className="inline">
              <button
                className="button secondary"
                type="button"
                onClick={() => setStep(0)}
              >
                Back
              </button>
              <button className="button" type="submit">
                Review starting point
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          <>
            <CheckCircle size={38} className="accent" />
            <h2>Your starting point is ready to review.</h2>
            <p>
              {files.length
                ? `${files.length} filename(s) previewed locally. `
                : ""}
              {summary && `You entered: “${summary}”. `}No claim was submitted
              and no documents were processed.
            </p>
            <p>
              The demo opens the complete CM-1024 synthetic scenario so you can
              explore evidence, review stages and deductions. It does not
              represent an extraction from your selected files.
            </p>
            <Link className="button" href="/app/claims/CM-1024">
              Open illustrative workspace
              <ArrowRight size={17} />
            </Link>
            <button className="text-link" onClick={() => setStep(1)}>
              Back to review
            </button>
          </>
        )}
      </section>
    </>
  );
}
