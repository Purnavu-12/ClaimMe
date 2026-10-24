"use client";
import { useState } from "react";
import Link from "next/link";
import { money, settlement, settlementLines } from "@/domain/engine";
import { Badge, SourceLink } from "./ui";
export function Settlement({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState("copay");
  const line = settlementLines.find((l) => l.id === selected)!;
  const bars = [
    {
      id: "bill",
      label: "Hospital bill",
      amount: settlement.bill,
      start: 0,
      end: 100,
    },
    ...settlementLines.map((l, i) => ({
      id: l.id,
      label: l.label,
      amount: -l.amount,
      start: i === 0 ? 95 : i === 1 ? 85 : 76.5,
      end: i === 0 ? 100 : i === 1 ? 95 : 85,
    })),
    {
      id: "total",
      label: "Settlement amount",
      amount: settlement.total,
      start: 0,
      end: 76.5,
    },
  ];
  return (
    <div className={`settlement ${compact ? "compact" : ""}`}>
      <div className="waterfall" aria-label="Settlement calculation in rupees">
        {bars.map((b) => (
          <button
            key={b.id}
            className={`waterfall-column ${b.id === selected ? "selected" : ""}`}
            onClick={() => {
              if (b.id !== "bill" && b.id !== "total") setSelected(b.id);
            }}
            disabled={b.id === "bill" || b.id === "total"}
            aria-pressed={b.id === selected}
          >
            <strong>{money(b.amount)}</strong>
            <div className="bar-space">
              <span
                className={`waterfall-bar ${b.id === "bill" || b.id === "total" ? "total" : ""}`}
                style={{ height: `${b.end - b.start}%`, bottom: `${b.start}%` }}
              />
            </div>
            <span>{b.label}</span>
            {b.id === "copay" && <small>on ₹85,000</small>}
          </button>
        ))}
      </div>
      <p className="fine">
        Illustrative calculation · 10% co-pay on ₹85,000. Not a universal policy
        formula.
      </p>
      {!compact && (
        <div className="split deduction-detail" aria-live="polite">
          <section>
            <Badge tone="orange">Selected deduction</Badge>
            <h2>{line.label}</h2>
            <p className="amount">{money(line.amount)}</p>
            <code className="formula">{line.formula}</code>
            <p>{line.explanation}</p>
            <SourceLink source={line.source} />
          </section>
          <section className="tinted">
            <h3>Can I question this deduction?</h3>
            <p>
              You can ask for the relevant evidence and calculation. A question
              does not establish that the deduction is incorrect.
            </p>
            {line.policy && (
              <Link
                className="text-link"
                href={`/app/policies/EH-2026?clause=${line.policy}`}
              >
                Read the policy clause →
              </Link>
            )}
            <Link className="text-link" href="/app/claims/CM-1024/dispute">
              Prepare a supported question →
            </Link>
            <p className="fine">
              Settlement letter recorded. Bank payment confirmation not
              supplied.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
