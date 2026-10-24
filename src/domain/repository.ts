import { emptyDemo, migrateDemo } from "./engine";
import type { DemoState } from "./model";
export const STORAGE_KEY = "claimme-demo-v2";
export interface DemoRepository {
  load(): DemoState;
  save(state: DemoState): void;
  reset(): DemoState;
}
export class BrowserDemoRepository implements DemoRepository {
  constructor(
    private storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  ) {}
  load() {
    try {
      return migrateDemo(
        JSON.parse(
          this.storage.getItem(STORAGE_KEY) ??
            this.storage.getItem("claimme-demo-v1") ??
            "null",
        ),
      );
    } catch {
      return emptyDemo();
    }
  }
  save(state: DemoState) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  reset() {
    this.storage.removeItem(STORAGE_KEY);
    this.storage.removeItem("claimme-demo-v1");
    return emptyDemo();
  }
}
