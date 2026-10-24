"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Brand, ButtonLink, Field } from "./ui";
import { useDemo } from "./demo-provider";
export function Account({ mode }: { mode: string }) {
  const [notice, setNotice] = useState("");
  const titles: Record<string, string> = {
    "sign-in": "A clearer picture awaits.",
    "sign-up": "Clarity starts here.",
    "forgot-password": "Find your way back.",
    "verify-email": "One more step, explained.",
  };
  return (
    <div className="account-page">
      <header>
        <Brand />
        <Link href="/" className="text-link">
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </header>
      <main id="main" className="account-layout">
        <section className="account-story">
          <p className="eyebrow section-label">Your claim companion</p>
          <h1>
            Every question <br />
            deserves <br />a clear source.
          </h1>
          <p>
            Understand what changed, verify the evidence, and know what you can
            do next.
          </p>
          <div className="account-quote">
            <CheckCircle size={23} />
            <p>
              ClaimMe explains.
              <br />
              <strong>Your insurer decides.</strong>
            </p>
          </div>
        </section>
        <section className="account-form">
          <p className="eyebrow">{mode.replaceAll("-", " ")}</p>
          <h2>{titles[mode]}</h2>
          <p className="muted">
            Frontend demonstration. No live account service is connected. Use
            fictional details only.
          </p>
          {mode === "verify-email" ? (
            <>
              <div className="notice">
                <h3>No verification email has been sent.</h3>
                <p>
                  This screen previews the future verification step. Explore the
                  demo directly.
                </p>
              </div>
              <ButtonLink href="/onboarding">Explore demo</ButtonLink>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNotice(
                  mode === "forgot-password"
                    ? "The form is valid. No recovery message was sent because account services are not connected."
                    : "The form is valid. No credentials were sent or account created. Use Explore demo to continue.",
                );
              }}
            >
              {mode === "sign-up" && (
                <Field label="Fictional name">
                  <input
                    name="name"
                    autoComplete="off"
                    required
                    maxLength={60}
                  />
                </Field>
              )}
              <Field label="Email address">
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                  required
                />
              </Field>
              {mode !== "forgot-password" && (
                <Field label="Demo password (do not use a real password)">
                  <input
                    type="password"
                    autoComplete="off"
                    minLength={8}
                    required
                    placeholder="At least 8 characters"
                  />
                </Field>
              )}
              {mode === "sign-up" && (
                <label className="checkbox-line">
                  <input required type="checkbox" />I understand this is a demo
                  and will use fictional details.
                </label>
              )}
              <button className="button full-width">
                {mode === "forgot-password"
                  ? "Check recovery form"
                  : mode === "sign-up"
                    ? "Check sign-up form"
                    : "Check sign-in form"}
                <ArrowRight size={17} />
              </button>
              {notice && (
                <p role="status" className="notice">
                  {notice}
                </p>
              )}
              {mode === "sign-in" && (
                <Link className="text-link" href="/forgot-password">
                  Forgot password?
                </Link>
              )}
              <div className="or-divider">or explore without an account</div>
              <ButtonLink secondary href="/onboarding">
                Explore demo
              </ButtonLink>
              <p className="fine">
                {mode === "sign-up" ? "Already exploring?" : "New to ClaimMe?"}{" "}
                <Link href={mode === "sign-up" ? "/sign-in" : "/sign-up"}>
                  {mode === "sign-up" ? "Sign-in screen" : "See sign-up"}
                </Link>
              </p>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
export function Onboarding() {
  const { state, update } = useDemo();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState(state.onboarding.intent);
  const [hasClaim, setHasClaim] = useState("Yes");
  const [files, setFiles] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const steps = [
    "Your goal",
    "Your starting point",
    "Available documents",
    "Your privacy",
  ];
  return (
    <div className="onboarding-page">
      <header className="public-header">
        <Brand />
        <Link href="/" className="text-link">
          Back to home
        </Link>
      </header>
      <main id="main" className="onboarding-main">
        <p className="eyebrow">A clearer next step · {step + 1} of 4</p>
        <div className="onboarding-progress">
          {steps.map((s, i) => (
            <span className={i <= step ? "active" : ""} key={s} />
          ))}
        </div>
        <h1>
          {
            [
              "What would you like help with?",
              "Do you already have a claim?",
              "Start with what you have.",
              "Know what stays in your browser.",
            ][step]
          }
        </h1>
        <p className="muted">
          {
            [
              "Choose the question that matters most.",
              "We’ll use an illustrative claim to show you how the workspace works.",
              "Optional filename preview only. Use synthetic documents. No file content is read or uploaded.",
              "Demo edits and preferences are stored locally. No account or insurer connection is created.",
            ][step]
          }
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) setStep(step + 1);
          }}
        >
          {step === 0 ? (
            <div className="choice-list">
              {[
                "Understand my claim",
                "Compare my documents",
                "Explain my deductions",
                "Prepare a grievance",
              ].map((item) => (
                <label className="choice" key={item}>
                  <input
                    type="radio"
                    name="intent"
                    checked={intent === item}
                    onChange={() => setIntent(item)}
                  />
                  <strong>{item}</strong>
                </label>
              ))}
            </div>
          ) : step === 1 ? (
            <div className="choice-list">
              {["Yes", "Not yet", "I’m exploring for someone else"].map(
                (item) => (
                  <label className="choice" key={item}>
                    <input
                      type="radio"
                      name="hasClaim"
                      checked={hasClaim === item}
                      onChange={() => setHasClaim(item)}
                    />
                    <strong>{item}</strong>
                  </label>
                ),
              )}
            </div>
          ) : step === 2 ? (
            <>
              <Field label="Preview synthetic filenames (optional)">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    setFiles(
                      Array.from(e.target.files ?? []).map((f) => f.name),
                    );
                    e.target.value = "";
                  }}
                />
              </Field>
              {files.length > 0 && (
                <p role="status">
                  {files.length} filename(s): {files.join(", ")}. No content
                  read.
                </p>
              )}
              <div className="tinted">
                <h3>No documents? You can still explore.</h3>
                <p>
                  The workspace includes a policy, claim form, hospital bill,
                  discharge summary and insurer letters—all synthetic.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="tinted">
                <h3>Your choices, in view.</h3>
                <p>
                  Goal: {intent}
                  <br />
                  Starting point: {hasClaim}
                  <br />
                  Source: complete synthetic claim CM-1024
                </p>
                <p>
                  Demo data is not an encrypted vault. You can export or reset
                  local edits from Settings. Selected files are not stored.
                </p>
              </div>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I understand the local demo behavior. This does not authorize
                  external processing.
                </span>
              </label>
            </>
          )}
          <div className="onboarding-actions">
            {step > 0 && (
              <button
                type="button"
                className="button secondary"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button className="button">
                {step === 2 ? "Continue with illustrative claim" : "Continue"}
                <ArrowRight size={17} />
              </button>
            ) : (
              <Link
                className={`button ${!consent ? "disabled-link" : ""}`}
                aria-disabled={!consent}
                href="/app"
                onClick={(e) => {
                  if (!consent) {
                    e.preventDefault();
                    return;
                  }
                  update((s) => ({
                    ...s,
                    onboarding: { intent, hasClaim },
                    consent: { localDemo: true, at: new Date().toISOString() },
                    audit: [
                      ...s.audit,
                      {
                        id: crypto.randomUUID(),
                        at: new Date().toISOString(),
                        actor: "Demo customer",
                        kind: "consent",
                        description:
                          "Acknowledged browser-local demo behavior during onboarding.",
                      },
                    ],
                  }));
                }}
              >
                Open demo workspace
                <ArrowRight size={17} />
              </Link>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
