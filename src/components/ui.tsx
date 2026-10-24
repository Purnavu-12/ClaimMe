"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  ArrowRight,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import type { Source } from "@/domain/model";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="ClaimMe home">
      Claim<span>Me</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "secondary" : ""} ${className}`}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warning" | "success" | "orange";
}) {
  return (
    <span className={`badge ${tone}`}>
      {tone === "warning" ? (
        <WarningCircle size={14} />
      ) : tone === "success" ? (
        <CheckCircle size={14} />
      ) : null}
      {children}
    </span>
  );
}
export function SourceLink({ source }: { source: Source }) {
  return (
    <Link
      className="source-link"
      href={`/app/claims/CM-1024/evidence?doc=${source.documentId}`}
    >
      <FileText size={16} />
      <span>
        {source.label} · p. {source.page}
      </span>
      <ArrowUpRight size={14} />
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function EmptyState({
  title,
  description,
  href,
  label = "Go to claims",
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <FileText size={36} weight="light" />
      <h2>{title}</h2>
      <p>{description}</p>
      {href && <ButtonLink href={href}>{label}</ButtonLink>}
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Disclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="disclosure">
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
