"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cube, FileText } from "@phosphor-icons/react";
import { documents } from "@/domain/fixtures";
import { Badge, SourceLink } from "./ui";
const Scene = dynamic(() => import("./evidence-scene"), {
  ssr: false,
  loading: () => (
    <p className="scene-fallback" role="status">
      Opening the 3D view…
    </p>
  ),
});
export function EvidenceAtlas() {
  const [selected, setSelected] = useState("conflict");
  const [threeD, setThreeD] = useState(false);
  const doc = documents.find((d) => d.id === selected);
  return (
    <section className="atlas" aria-label="Explore an illustrative claim">
      <div className="atlas-visual">
        {threeD ? (
          <Scene selected={selected} onSelect={setSelected} />
        ) : (
          <>
            <Image
              src="/assets/evidence-landscape-v2.png"
              alt="Four dimensional document stacks connected on a warm paper surface"
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              priority
              className="atlas-art"
            />
            {[
              {
                id: "bill",
                name: "Hospital bill",
                detail: "12 Oct 2026",
                cls: "bill",
              },
              {
                id: "discharge",
                name: "Discharge summary",
                detail: "13 Oct 2026",
                cls: "discharge",
              },
              {
                id: "receipt",
                name: "Insurer message",
                detail: "Document received",
                cls: "receipt",
              },
              {
                id: "policy",
                name: "Policy clause",
                detail: "Renewal continuity",
                cls: "policy",
              },
            ].map((d) => (
              <button
                key={d.id}
                className={`atlas-label ${d.cls} ${selected === d.id ? "selected" : ""}`}
                onClick={() => setSelected(d.id)}
              >
                <FileText size={18} />
                <strong>{d.name}</strong>
                <span>{d.detail}</span>
              </button>
            ))}
            <button
              onClick={() => setSelected("conflict")}
              className="conflict-node"
            >
              <span className="orange-dot" />
              Discharge date
              <br />
              needs verification
            </button>
          </>
        )}
      </div>
      <aside className="atlas-inspector" aria-live="polite">
        <p className="fine">Illustrative claim · CM-1024</p>
        <div className="inspector-body">
          <h2>{doc ? doc.title : "One date. Two sources."}</h2>
          <p>
            {doc
              ? doc.id === "policy"
                ? "The policy is available. Renewal payment evidence is still needed to verify continuity."
                : doc.id === "receipt"
                  ? "The insurer received the requested document. Review then resumed."
                  : `This source records a discharge date of ${doc.fields[0]?.value}. Compare it with the other record.`
              : "These documents show different discharge dates. Verify with the hospital."}
          </p>
          <Badge tone={selected === "receipt" ? "neutral" : "warning"}>
            {selected === "receipt" ? "Source available" : "Needs verification"}
          </Badge>
          <div className="inspector-sources">
            {(doc ? [doc] : documents.slice(0, 2)).map((d, i) => (
              <div key={d.id}>
                <span className="fine">Source {i + 1}</span>
                <SourceLink
                  source={{ documentId: d.id, label: d.title, page: 1 }}
                />
                <span className="source-date">
                  {d.fields[0]?.value ?? d.received}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div
        className="atlas-accessible"
        role="group"
        aria-label="Select a document"
      >
        <button
          className="atlas-3d-control"
          aria-pressed={threeD}
          onClick={() => setThreeD(!threeD)}
        >
          <Cube size={16} />
          {threeD ? "Back to artwork" : "Explore in 3D"}
        </button>
        {[
          { id: "conflict", title: "Date mismatch" },
          ...documents.filter((d) =>
            ["bill", "discharge", "receipt", "policy"].includes(d.id),
          ),
        ].map((d) => (
          <button
            key={d.id}
            aria-pressed={selected === d.id}
            onClick={() => setSelected(d.id)}
          >
            {d.title}
          </button>
        ))}
        <Link
          href="/app/claims/CM-1024/evidence?compare=1"
          className="atlas-compare-link"
        >
          Compare documents <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
