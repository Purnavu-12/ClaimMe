"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Play,
  List,
  X,
  ArrowUpRight,
  FileText,
  HouseLine,
  CalendarCheck,
  Sparkle,
  DotsThree,
} from "@phosphor-icons/react";
import { Brand, ButtonLink } from "./ui";
import { EvidenceAtlas } from "./evidence-atlas";
import { ClaimReplay } from "./claim-replay";
import { Settlement } from "./settlement";
export function Landing() {
  const [menu, setMenu] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="public-site">
      <header className="public-header">
        <Brand />
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          <a onClick={() => setMenu(false)} href="#how-it-works">
            How it works
          </a>
          <a onClick={() => setMenu(false)} href="#claim-replay">
            Claim Replay
          </a>
          <a onClick={() => setMenu(false)} href="#privacy">
            Privacy center
          </a>
        </nav>
        <div className="header-actions">
          <Link href="/sign-in">Sign in</Link>
          <ButtonLink href="/onboarding">Understand a claim</ButtonLink>
        </div>
        <button
          className="menu-button"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
        >
          {menu ? <X size={24} /> : <List size={24} />}
        </button>
      </header>
      <main id="main">
        <div className="evidence-hero-stage">
          <nav
            className="evidence-margin evidence-margin-left"
            aria-label="Explore example claim sources"
          >
            <Link href="/app/claims/CM-1024/evidence?doc=bill">
              <FileText size={23} />
              <strong>Hospital bill</strong>
              <span>12 Oct 2026</span>
            </Link>
            <Link href="/app/claims/CM-1024/messages">
              <HouseLine size={23} />
              <strong>Document received</strong>
              <span>16 Oct 2026</span>
            </Link>
            <p>[ CLAIM FLOW ]</p>
          </nav>
          <nav
            className="evidence-margin evidence-margin-right"
            aria-label="Explore example claim context"
          >
            <Link href="/app/claims/CM-1024/evidence?compare=1">
              <CalendarCheck size={23} />
              <strong>Date verification</strong>
              <span>13 Oct 2026</span>
            </Link>
            <Link href="/app/claims/CM-1024/policy">
              <FileText size={23} />
              <strong>Policy clause</strong>
              <span>Clause 2.1</span>
            </Link>
            <a href="#how-it-works">
              <Sparkle size={25} />
              <strong>Explanation</strong>
              <span>With evidence</span>
            </a>
            <p>[ INSURER DECISION ]</p>
          </nav>
          <motion.section
            className="landing-hero"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.55 }}
          >
            <p className="evidence-coordinate">[ EVIDENCE, CONNECTED ]</p>
            <h1>
              Understand your
              <br />
              <span className="accent">insurance claim.</span>
            </h1>
            <p className="hero-description">
              Every status. Every document. Every deduction.
              <br className="mobile-break" /> Explained with evidence.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/onboarding">Understand a claim</ButtonLink>
              <a className="button secondary" href="#claim-replay">
                <Play size={16} />
                See how ClaimMe works
              </a>
            </div>
            <p className="hero-trust">
              ClaimMe explains. Your insurer decides.
            </p>
          </motion.section>
        </div>
        <div className="atlas-frame">
          <div className="atlas-toolbar">
            <div>
              <span className="orange-dot" />
              <strong>The evidence atlas</strong>
              <span className="atlas-toolbar-divider">/</span>
              <span>Illustrative claim · CM-1024</span>
            </div>
            <DotsThree
              size={24}
              className="atlas-toolbar-hint"
              aria-hidden="true"
            />
          </div>
          <EvidenceAtlas />
        </div>
        <section id="claim-replay" className="landing-section replay-section">
          <p className="eyebrow section-label">Claim Replay</p>
          <h2>The same status. A different reason.</h2>
          <p className="section-intro">
            Your insurer requested more information. The document was received,
            <br className="desktop-break" /> and the review has resumed. Follow
            what changed, and why.
          </p>
          <ClaimReplay compact />
        </section>
        <section
          id="how-it-works"
          className="landing-section grounding-section"
        >
          <div>
            <p className="eyebrow section-label">
              The explanation behind the update
            </p>
            <h2>
              Less jargon. <br />
              More understanding.
            </h2>
            <p>
              See the original wording, a plain-language explanation, and the
              evidence behind it. Know what’s established—and what still needs
              checking.
            </p>
            <ButtonLink href="/app/claims/CM-1024">
              Explore the claim workspace
            </ButtonLink>
          </div>
          <div className="translation">
            <p className="eyebrow">Insurer’s original message</p>
            <blockquote>
              “Additional documents received.
              <br />
              Under process.”
            </blockquote>
            <span className="translation-arrow">
              <ArrowRight size={24} />
            </span>
            <div className="translation-result">
              <p className="eyebrow">ClaimMe explains</p>
              <h3>
                Your documents were received.
                <br />
                The insurer resumed its review.
              </h3>
              <Link
                className="source-link"
                href="/app/claims/CM-1024/evidence?doc=receipt"
              >
                Example insurer message · p. 1<ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <section className="landing-section settlement-section">
          <div>
            <p className="eyebrow section-label">Settlement breakdown</p>
            <h2>
              Know where <br />
              every rupee went.
            </h2>
            <p>
              See how your billed amount becomes the final settlement, with each
              deduction explained using your documents.
            </p>
            <Link className="text-link" href="/app/claims/CM-1024/settlement">
              Inspect a deduction
              <ArrowRight size={17} />
            </Link>
          </div>
          <div>
            <Settlement compact />
            <Link
              href="/app/claims/CM-1024/evidence?doc=settlement"
              className="source-link"
            >
              Example settlement letter · p. 1<ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
        <section className="landing-section policy-preview">
          <p className="eyebrow section-label">Grounded in your policy</p>
          <div className="split">
            <div>
              <h2>
                The clause.
                <br />
                The context. The question.
              </h2>
              <p>
                A policy document is a starting point, not a coverage decision.
                Open the relevant wording and see what evidence is still
                missing.
              </p>
            </div>
            <div className="policy-quote">
              <span className="fine">EXAMPLE POLICY · CLAUSE 2.1</span>
              <h3>Renewal continuity</h3>
              <p>
                The current policy starts on 1 October. The previous period
                ended on 28 September.
              </p>
              <p className="warning-copy">
                Continuity needs verification. A renewal receipt and any
                endorsements are still needed.
              </p>
              <Link href="/app/policies/EH-2026" className="text-link">
                Read the source clause
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section id="privacy" className="privacy-section">
          <div>
            <p className="eyebrow section-label">Your data</p>
            <h2>
              Your documents.
              <br />
              Your control.
            </h2>
            <p>
              Explore safely with a synthetic claim. Demo preferences and
              corrections stay in this browser. No documents are uploaded to an
              insurer.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/app/settings/privacy" secondary>
                Review consent
              </ButtonLink>
              <ButtonLink href="/app/settings/data" secondary>
                Data settings
              </ButtonLink>
            </div>
          </div>
          <div className="privacy-art">
            <Image
              src="/assets/privacy-documents.png"
              alt="Paper documents gathered with a leather strap on a sunlit desk"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </section>
        <section className="final-cta">
          <p className="eyebrow">Understand → Verify → Explain → Act</p>
          <h2>Make sense of your next step.</h2>
          <p>Start with a claim. Leave with a clearer picture.</p>
          <ButtonLink href="/onboarding">Understand a claim</ButtonLink>
        </section>
      </main>
      <footer className="public-footer">
        <div>
          <Brand />
          <p>A clearer way to follow your health-insurance claim.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/app/help">Help</Link>
          <Link href="/app/settings/privacy">Privacy center</Link>
          <Link href="/app">Explore demo</Link>
        </nav>
        <p>
          © 2026 ClaimMe.
          <br />
          Illustrative demo. Not an insurer.
        </p>
      </footer>
    </div>
  );
}
