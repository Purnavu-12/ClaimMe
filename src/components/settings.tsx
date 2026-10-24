"use client";
import Link from "next/link";
import { useState } from "react";
import { DownloadSimple, Trash, ShieldCheck } from "@phosphor-icons/react";
import { downloadJson, useDemo } from "./demo-provider";
import { Badge, Field, PageHeading } from "./ui";
export function Settings({ tab }: { tab: string }) {
  const { state, update, reset, ready } = useDemo();
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState<string | null>(null);
  return (
    <>
      <PageHeading
        eyebrow="Your workspace, your preferences"
        title="Settings"
        description="This demo stores preferences and synthetic edits locally in this browser."
      />
      <nav className="tabs settings-tabs" aria-label="Settings">
        {["profile", "privacy", "security", "notifications", "data"].map(
          (t) => (
            <Link
              key={t}
              href={`/app/settings/${t}`}
              aria-current={tab === t ? "page" : undefined}
            >
              {t}
            </Link>
          ),
        )}
      </nav>
      <section className="settings-panel">
        {tab === "profile" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                preferences: {
                  ...s.preferences,
                  name: (name ?? state.preferences.name).trim(),
                },
              }));
              setNotice("Demo display name saved in this browser.");
            }}
          >
            <h2>A familiar workspace.</h2>
            <p>Use a fictional name. No account or identity is created.</p>
            <Field label="Demo display name">
              <input
                required
                maxLength={60}
                value={name ?? state.preferences.name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <button
              className="button"
              disabled={!ready || !(name ?? state.preferences.name).trim()}
            >
              Save preference
            </button>
          </form>
        ) : tab === "privacy" ? (
          <>
            <h2>Know what you share.</h2>
            <p>
              ClaimMe’s demo includes synthetic claim material. Your
              corrections, draft text, preferences and consent choice are stored
              in this browser. Files selected for preview are not uploaded or
              read.
            </p>
            <div className="consent-row">
              <label className="choice">
                <input
                  type="checkbox"
                  checked={state.consent.localDemo}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    update((s) => ({
                      ...s,
                      consent: {
                        localDemo: checked,
                        at: new Date().toISOString(),
                      },
                      audit: [
                        ...s.audit,
                        {
                          id: crypto.randomUUID(),
                          at: new Date().toISOString(),
                          actor: "Demo customer",
                          kind: "consent",
                          description: `Optional demo consent acknowledgement ${checked ? "recorded" : "withdrawn"}.`,
                        },
                      ],
                    }));
                  }}
                />
                <span>
                  <strong>I understand the browser-local demo behavior.</strong>
                  <small>
                    This acknowledgement does not authorize a real upload or
                    external processing.
                  </small>
                </span>
              </label>
            </div>
            <p className="fine">
              Last recorded choice:{" "}
              {state.consent.at
                ? new Date(state.consent.at).toLocaleString("en-IN")
                : "Not recorded"}
            </p>
            <Link className="text-link" href="/app/settings/data">
              Export or reset your local demo data →
            </Link>
          </>
        ) : tab === "security" ? (
          <>
            <ShieldCheck size={36} weight="light" />
            <h2>Security, without pretend assurances.</h2>
            <Badge>Live account security unavailable</Badge>
            <p>
              No real accounts, private document store or insurer connection are
              configured. Password forms do not transmit credentials.
              Browser-local demo data is not an encrypted document vault.
            </p>
            <p>
              Use synthetic information only. Session management, multi-factor
              authentication, access controls and production retention policies
              require backend integration.
            </p>
          </>
        ) : tab === "notifications" ? (
          <>
            <h2>Keep updates useful.</h2>
            <label className="choice">
              <input
                type="checkbox"
                checked={state.preferences.notifications}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    preferences: {
                      ...s.preferences,
                      notifications: e.target.checked,
                    },
                  }))
                }
              />
              <span>
                <strong>Remember my preference for claim updates</strong>
                <small>
                  Preference only. No email, SMS, browser push or reminders are
                  sent.
                </small>
              </span>
            </label>
          </>
        ) : (
          <>
            <h2>Your demo data.</h2>
            <p>
              Stored here: {Object.keys(state.corrections).length} corrections,{" "}
              {state.audit.length} audit entries, your draft and preferences.
              The synthetic source documents are bundled with the application.
            </p>
            <div className="inline">
              <button
                className="button secondary"
                onClick={() => {
                  downloadJson("claimme-demo-export.json", state);
                  setNotice(
                    "Demo data exported. No original documents are included.",
                  );
                }}
              >
                <DownloadSimple size={18} />
                Export demo data
              </button>
              <button
                className="button secondary"
                onClick={() => setConfirm(true)}
              >
                <Trash size={18} />
                Reset demo data
              </button>
            </div>
            {confirm && (
              <div className="notice">
                <h3>Reset edits in this browser?</h3>
                <p>
                  This removes your corrections, draft, action reviews and
                  preferences, restoring the synthetic starting point.
                </p>
                <div className="inline">
                  <button
                    className="button"
                    onClick={() => {
                      reset();
                      setConfirm(false);
                      setNotice("Local demo data reset to its starting point.");
                    }}
                  >
                    Reset local data
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setConfirm(false)}
                  >
                    Keep my changes
                  </button>
                </div>
              </div>
            )}
            <p className="fine">
              Closing the tab does not delete local storage. Reset applies to
              this browser and origin only.
            </p>
          </>
        )}
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
      </section>
    </>
  );
}
