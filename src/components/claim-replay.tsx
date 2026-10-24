"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { events } from "@/domain/fixtures";
import { stateAt } from "@/domain/engine";
import { Badge, SourceLink } from "./ui";
export function ClaimReplay({ compact = false }: { compact?: boolean }) {
  const history = compact ? [events[2], events[3], events[4]] : events;
  const [index, setIndex] = useState(compact ? 2 : 4);
  const [playing, setPlaying] = useState(false);
  const event = history[index];
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () =>
        setIndex((i) => {
          if (i >= history.length - 1) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        }),
      2200,
    );
    return () => clearInterval(id);
  }, [playing, history.length]);
  const select = (i: number) => {
    setPlaying(false);
    setIndex(i);
  };
  return (
    <div className={`replay ${compact ? "compact" : ""}`}>
      <div className="replay-track" role="group" aria-label="Claim events">
        {history.map((e, i) => (
          <button
            key={e.id}
            onClick={() => select(i)}
            aria-pressed={i === index}
            className={`event-stop ${i === index ? "selected" : ""}`}
          >
            <span className="event-dot" />
            <time>
              {new Date(e.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                timeZone: "Asia/Kolkata",
              })}{" "}
              2026
            </time>
            <strong>{e.title}</strong>
          </button>
        ))}
      </div>
      <div className="replay-controls">
        <button
          className="button secondary small"
          disabled={index === 0}
          onClick={() => select(index - 1)}
        >
          <ArrowLeft size={16} />
          Previous event
        </button>
        <button
          className="round-button"
          aria-label={playing ? "Pause replay" : "Play replay"}
          onClick={() => {
            if (index === history.length - 1) setIndex(0);
            setPlaying(!playing);
          }}
        >
          {playing ? (
            <Pause size={20} weight="fill" />
          ) : (
            <Play size={20} weight="fill" />
          )}
        </button>
        <button
          className="button secondary small"
          disabled={index === history.length - 1}
          onClick={() => select(index + 1)}
        >
          Next event
          <ArrowRight size={16} />
        </button>
      </div>
      {!compact && (
        <label className="field">
          <span>
            Scrub through the journey · event {index + 1} of {history.length}
          </span>
          <input
            aria-label="Journey event"
            type="range"
            min={0}
            max={history.length - 1}
            value={index}
            onChange={(e) => select(Number(e.target.value))}
          />
        </label>
      )}
      <div
        aria-live="polite"
        className={compact ? "replay-caption" : "replay-context"}
        key={event.id}
      >
        {compact ? (
          <p>{event.explanation}</p>
        ) : (
          <>
            <div className="split">
              <section>
                <Badge tone="orange">{event.actor} reported</Badge>
                <h2>{event.title}</h2>
                <p>{event.explanation}</p>
                <h3>What remains uncertain</h3>
                <p className="muted">{event.uncertainty}</p>
                <h3>Next step at this point</h3>
                <p>{event.next}</p>
                {event.sources.map((s) => (
                  <SourceLink key={s.documentId} source={s} />
                ))}
              </section>
              <section className="tinted">
                <p className="eyebrow">State at this event</p>
                {Object.entries(
                  stateAt(events.findIndex((e) => e.id === event.id)),
                ).map(([k, v]) => (
                  <div className="state-row" key={k}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
                <p className="fine">
                  Only {event.documentIds.length} documents were available at
                  this point. Later evidence is not used to explain earlier
                  events.
                </p>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
