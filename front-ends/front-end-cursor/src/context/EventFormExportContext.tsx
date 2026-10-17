import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  materializeEventFormImport,
  parseEventFormImport,
  type AppliedEventImport,
  type EventFormExportSnapshots,
} from '../lib/eventFormExport';

type EventFormExportSection = keyof EventFormExportSnapshots;

type EventFormExportContextValue = {
  snapshots: EventFormExportSnapshots;
  report: (section: EventFormExportSection, value: EventFormExportSnapshots[EventFormExportSection]) => void;
  appliedImport: AppliedEventImport | null;
  applyImport: (raw: string) => string | null;
};

const EventFormExportContext = createContext<EventFormExportContextValue | null>(null);

export function EventFormExportProvider({ children }: { children: ReactNode }) {
  const [snapshots, setSnapshots] = useState<EventFormExportSnapshots>({});
  const [appliedImport, setAppliedImport] = useState<AppliedEventImport | null>(null);
  const importTokenRef = useRef(0);

  const report = useCallback(
    (section: EventFormExportSection, value: EventFormExportSnapshots[EventFormExportSection]) => {
      setSnapshots((current) => {
        if (JSON.stringify(current[section]) === JSON.stringify(value)) {
          return current;
        }

        return { ...current, [section]: value };
      });
    },
    [],
  );

  const applyImport = useCallback((raw: string) => {
    const parsed = parseEventFormImport(raw);
    if (!parsed.ok) {
      return parsed.error;
    }

    importTokenRef.current += 1;
    setAppliedImport(materializeEventFormImport(parsed.document, importTokenRef.current));
    return null;
  }, []);

  const contextValue = useMemo(
    () => ({ snapshots, report, appliedImport, applyImport }),
    [appliedImport, applyImport, report, snapshots],
  );

  return (
    <EventFormExportContext.Provider value={contextValue}>
      {children}
    </EventFormExportContext.Provider>
  );
}

export function useEventFormExportSnapshots(): EventFormExportSnapshots {
  return useContext(EventFormExportContext)?.snapshots ?? {};
}

const reportNothing = () => undefined;

export function useReportEventFormSection(): EventFormExportContextValue['report'] {
  return useContext(EventFormExportContext)?.report ?? reportNothing;
}

export function useAppliedEventImport(): AppliedEventImport | null {
  return useContext(EventFormExportContext)?.appliedImport ?? null;
}

const rejectImport = () => 'Import is not available.';

export function useApplyEventFormImport(): (raw: string) => string | null {
  return useContext(EventFormExportContext)?.applyImport ?? rejectImport;
}
