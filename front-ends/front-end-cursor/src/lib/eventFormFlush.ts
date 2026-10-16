type SyncFlush = () => void;

const syncFlushes = new Set<SyncFlush>();
let saveQueue: (() => Promise<void>) | null = null;

/** Run before the session is cleared so accordion commits can still authenticate. */
export function registerEventFormSyncFlush(flush: SyncFlush): () => void {
  syncFlushes.add(flush);
  return () => {
    syncFlushes.delete(flush);
  };
}

/** Await the create-event save queue after sync flushes have enqueued. */
export function registerEventFormSaveQueue(wait: () => Promise<void>): () => void {
  saveQueue = wait;
  return () => {
    if (saveQueue === wait) {
      saveQueue = null;
    }
  };
}

export async function flushEventFormSaves(): Promise<void> {
  for (const flush of [...syncFlushes]) {
    try {
      flush();
    } catch {
      // One section failing to commit should not skip the others.
    }
  }

  try {
    await saveQueue?.();
  } catch {
    // The queue reports save errors itself.
  }
}
