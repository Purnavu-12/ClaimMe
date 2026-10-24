"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Stack,
  Files,
  ShieldCheck,
  Lightbulb,
  Scales,
  Question,
  GearSix,
  ArrowUpRight,
  List,
  X,
  CheckSquare,
  ArrowRight,
} from "@phosphor-icons/react";
import { Brand } from "./ui";
import { useDemo } from "./demo-provider";
import { actions, claims } from "@/domain/fixtures";
const nav = [
  ["Home", "/app", House],
  ["Claims", "/app/claims", Stack],
  ["Documents", "/app/documents", Files],
  ["Policies", "/app/policies", ShieldCheck],
  ["Insights", "/app/insights", Lightbulb],
  ["Disputes", "/app/disputes", Scales],
  ["Actions", "/app/actions", CheckSquare],
  ["Help", "/app/help", Question],
] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useDemo();
  const remainingActions = actions.filter(
    (a) => !state.completedActions.includes(a.id),
  ).length;
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    closeRef.current?.focus();
    return () => {
      opener?.focus();
    };
  }, [open]);
  const claim = path.match(/^\/app\/claims\/(CM-\d+)/)?.[1];
  return (
    <div className="app-shell">
      <aside
        ref={sidebarRef}
        className={`sidebar ${open ? "open" : ""}`}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Tab") {
            const focusable =
              sidebarRef.current?.querySelectorAll<HTMLElement>(
                "a[href], button",
              );
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
            if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="sidebar-brand">
          <Brand />
          <button
            className="menu-button"
            ref={closeRef}
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <p className="eyebrow sidebar-label">Your workspace</p>
        <nav aria-label="Application">
          {nav.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={
                (href === "/app" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              <Icon size={20} />
              {label}
              {label === "Actions" && (
                <span className="nav-count">{remainingActions}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/app/settings/profile">
            <GearSix size={20} />
            Settings
          </Link>
          <div className="sidebar-demo">
            <span className="orange-dot" />A safe space to explore
            <p>Synthetic claim. Real clarity.</p>
            <Link href="/">
              View public site
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="profile">
            <span className="avatar">AS</span>
            <div>
              <strong>Demo workspace</strong>
              <small>Browser-local data</small>
            </div>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="nav-overlay"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="app-body">
        <header className="app-topbar">
          <button
            className="menu-button"
            aria-label="Open navigation"
            ref={openerRef}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <List size={23} />
          </button>
          <div className="breadcrumb">
            <Link href="/app">Workspace</Link>
            <span>/</span>
            <span>
              {claim ??
                path.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ")}
            </span>
          </div>
          <div className="topbar-right">
            <span className="demo-label">
              <span className="orange-dot" />
              Illustrative demo
            </span>
            <Link href="/app/help" aria-label="Open help">
              <Question size={21} />
            </Link>
          </div>
        </header>
        <main id="main" className="workspace-main">
          {claim && (
            <div className="claim-nav">
              <Link href="/app/claims" className="fine">
                ← All claims
              </Link>
              <div>
                <strong>{claim}</strong>
                <span className="fine">
                  {claims.find((c) => c.id === claim)?.type} · Example Health
                  Insurance
                </span>
              </div>
              <nav aria-label="Claim navigation">
                {[
                  "Overview",
                  "Journey",
                  "Evidence",
                  "Policy",
                  "Settlement",
                  "Messages",
                  "Dispute",
                  "Activity",
                ].map((label) => {
                  const href = `/app/claims/${claim}${label === "Overview" ? "" : "/" + label.toLowerCase()}`;
                  return (
                    <Link
                      key={label}
                      href={href}
                      aria-current={path === href ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
          {children}
          <footer className="workspace-footer">
            <span>ClaimMe explains. Your insurer decides.</span>
            <Link href="/app/settings/data">
              Manage demo data
              <ArrowRight size={13} />
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
