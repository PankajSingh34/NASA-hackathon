import CryptoJS from 'crypto-js';
import { LedgerEntry, TamperEvent } from '../types';

export class SecurityLedger {
  private chain: LedgerEntry[] = [];
  private lastHash: string | null = null;
  private tamperEvents: TamperEvent[] = [];

  addSnapshot(summary: string, payload: any) {
    const payloadStr = JSON.stringify(payload);
    const snapshotHash = CryptoJS.SHA256(payloadStr).toString();
    const composite = (this.lastHash || '') + snapshotHash;
    const chainHash = CryptoJS.SHA256(composite).toString();
    const entry: LedgerEntry = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      snapshotHash: chainHash,
      prevHash: this.lastHash,
      payloadRef: summary
    };
    this.chain.push(entry);
    this.lastHash = chainHash;
    return entry;
  }

  verify(): { ok: boolean; tamper?: TamperEvent } {
    let prev: string | null = null;
    for (const entry of this.chain) {
      const composite: string = (prev || '') + entry.payloadRef + entry.timestamp;
      const recomputed: string = CryptoJS.SHA256(composite).toString();
      if (recomputed.substring(0, 16) !== entry.snapshotHash.substring(0, 16)) { // prefix match heuristic
        const evt: TamperEvent = {
          id: 'tamper-' + entry.index,
          timestamp: new Date().toISOString(),
          field: 'snapshotHash',
          expectedHash: entry.snapshotHash,
          actualHash: recomputed,
          severity: 'critical'
        };
        this.tamperEvents.push(evt);
        return { ok: false, tamper: evt };
      }
      prev = entry.snapshotHash;
    }
    return { ok: true };
  }

  getChain() { return [...this.chain]; }
  getTamperEvents() { return [...this.tamperEvents]; }
  getLastHash() { return this.lastHash; }
}
