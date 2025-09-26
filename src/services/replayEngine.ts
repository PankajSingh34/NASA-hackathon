import { EventLogEntry } from '../types';

export class ReplayLog {
  private entries: EventLogEntry[] = [];
  private pointer = 0;

  record(entry: Omit<EventLogEntry, 'id'>) {
    const full: EventLogEntry = { id: 'evt-' + (this.entries.length + 1), ...entry };
    this.entries.push(full);
  }

  getAll() { return [...this.entries]; }
  length() { return this.entries.length; }

  serialize(): string {
    return JSON.stringify(this.entries);
  }

  load(raw: string) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.entries = parsed;
        this.pointer = 0;
      }
    } catch (e) {
      console.warn('Failed to load replay log', e);
    }
  }

  stepForward(): EventLogEntry | null {
    if (this.pointer < this.entries.length) {
      return this.entries[this.pointer++];
    }
    return null;
  }

  resetPointer() { this.pointer = 0; }
}
