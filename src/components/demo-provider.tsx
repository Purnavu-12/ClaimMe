"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
import { emptyDemo } from "@/domain/engine";
import { BrowserDemoRepository } from "@/domain/repository";
import type { DemoState } from "@/domain/model";
type Snapshot = { state: DemoState; ready: boolean; storageError: string };
type DemoContext = Snapshot & {
  update: (fn: (state: DemoState) => DemoState) => void;
  reset: () => void;
};
const serverSnapshot: Snapshot = {
  state: emptyDemo(),
  ready: false,
  storageError: "",
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.ready) {
    try {
      snapshot = {
        state: new BrowserDemoRepository(localStorage).load(),
        ready: true,
        storageError: "",
      };
    } catch {
      snapshot = {
        ...snapshot,
        ready: true,
        storageError:
          "Browser storage is unavailable. Changes last only for this session.",
      };
    }
    emit();
  }
  return () => {
    listeners.delete(listener);
  };
}
function update(fn: (state: DemoState) => DemoState) {
  const state = fn(snapshot.state);
  let storageError = "";
  try {
    new BrowserDemoRepository(localStorage).save(state);
  } catch {
    storageError =
      "Changes could not be saved in this browser. Export your demo data to keep a copy.";
  }
  snapshot = { state, ready: true, storageError };
  emit();
}
function reset() {
  try {
    snapshot = {
      state: new BrowserDemoRepository(localStorage).reset(),
      ready: true,
      storageError: "",
    };
  } catch {
    snapshot = {
      state: emptyDemo(),
      ready: true,
      storageError:
        "Storage could not be cleared. Check your browser settings.",
    };
  }
  emit();
}
const Context = createContext<DemoContext | null>(null);
const getSnapshot = () => snapshot;
const getServerSnapshot = () => serverSnapshot;
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return (
    <Context.Provider value={{ ...current, update, reset }}>
      {children}
      {current.storageError && (
        <div className="storage-notice" role="status">
          {current.storageError}
        </div>
      )}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("DemoProvider is required");
  return context;
}
export function downloadJson(name: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
