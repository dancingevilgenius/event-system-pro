import type {
  TrainingInteraction,
  TrainingLesson,
  TrainingStep,
} from '../types/pageTraining';

export const PAGE_TRAINING_STORAGE_PREFIX = 'evp.pageTraining.';

export const TRAINING_COMPLETE_TEXT = 'Training complete.';

export type TrainingClickEvent = {
  type: 'click';
  elementId: string;
};

export type TrainingSelectEvent = {
  type: 'select';
  elementId: string;
  option: string;
};

export type TrainingDomEvent = TrainingClickEvent | TrainingSelectEvent;

export type TrainingApplyResult =
  | { status: 'ignore' }
  | { status: 'match'; step: TrainingStep; completedStepIds: string[] }
  | { status: 'failure'; step: TrainingStep };

export function isCoachEnabled(search: string): boolean {
  const query = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(query).get('coach') === '1';
}

export function trainingStorageKey(instructionCode: string): string {
  return `${PAGE_TRAINING_STORAGE_PREFIX}${instructionCode}`;
}

export function currentTrainingStep(
  lesson: TrainingLesson,
  completedStepIds: readonly string[],
): TrainingStep | null {
  return lesson.steps.find((step) => !completedStepIds.includes(step.id)) ?? null;
}

export function trainingPercent(lesson: TrainingLesson, completedStepIds: readonly string[]): number {
  if (lesson.steps.length === 0) {
    return 0;
  }

  const completed = lesson.steps.filter((step) => completedStepIds.includes(step.id)).length;
  return (completed / lesson.steps.length) * 100;
}

export function trainingProgressLabel(
  lesson: TrainingLesson,
  completedStepIds: readonly string[],
): string {
  const total = lesson.steps.length;
  const completed = lesson.steps.filter((step) => completedStepIds.includes(step.id)).length;
  const shown = Math.min(total, completed + (completed < total ? 1 : 0));
  return `Training: ${shown} of ${total}`;
}

export function readCompletedStepIds(storage: Storage, instructionCode: string): string[] {
  const raw = storage.getItem(trainingStorageKey(instructionCode));
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string' && value.trim() !== '');
  } catch {
    return [];
  }
}

export function writeCompletedStepIds(
  storage: Storage,
  instructionCode: string,
  completedStepIds: readonly string[],
): void {
  storage.setItem(trainingStorageKey(instructionCode), JSON.stringify(completedStepIds));
}

export function clearCompletedStepIds(storage: Storage, instructionCode: string): void {
  storage.removeItem(trainingStorageKey(instructionCode));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function parseInteraction(value: unknown): TrainingInteraction | null {
  if (!isRecord(value)) {
    return null;
  }

  const elementId = requiredText(value.elementId);
  if (!elementId) {
    return null;
  }

  if (value.type === 'click') {
    return { type: 'click', elementId };
  }

  if (value.type === 'select') {
    const option = requiredText(value.option);
    if (!option) {
      return null;
    }

    return { type: 'select', elementId, option };
  }

  return null;
}

function parseStep(value: unknown): TrainingStep | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = requiredText(value.id);
  const instruction = requiredText(value.instruction);
  const successMessage = requiredText(value.successMessage);
  const failureMessage = requiredText(value.failureMessage);
  const interaction = parseInteraction(value.interaction);

  if (!id || !instruction || !successMessage || !failureMessage || !interaction) {
    return null;
  }

  return { id, instruction, successMessage, failureMessage, interaction };
}

export function parseTrainingLesson(
  stepsJson: unknown,
  instructionCode: string,
  pagePath: string,
): TrainingLesson | null {
  const document = typeof stepsJson === 'string' ? safeJsonParse(stepsJson) : stepsJson;
  if (!isRecord(document)) {
    return null;
  }

  const code = requiredText(instructionCode);
  const path = requiredText(pagePath);
  const title = requiredText(document.title) ?? 'Training';
  const fromPage = requiredText(document.fromPage) ?? '';
  if (!code || !path || !Array.isArray(document.steps)) {
    return null;
  }

  const steps = document.steps.map(parseStep);
  if (steps.length === 0 || steps.some((step) => step === null)) {
    return null;
  }

  return {
    instructionCode: code,
    pagePath: path,
    title,
    fromPage,
    steps: steps as TrainingStep[],
  };
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function eventsMatch(interaction: TrainingInteraction, event: TrainingDomEvent): boolean {
  if (interaction.type !== event.type || interaction.elementId !== event.elementId) {
    return false;
  }

  if (interaction.type === 'select' && event.type === 'select') {
    return interaction.option === event.option;
  }

  return interaction.type === 'click';
}

export function applyTrainingEvent(
  lesson: TrainingLesson,
  completedStepIds: readonly string[],
  event: TrainingDomEvent,
): TrainingApplyResult {
  const step = currentTrainingStep(lesson, completedStepIds);
  if (!step) {
    return { status: 'ignore' };
  }

  const { interaction } = step;
  if (interaction.elementId !== event.elementId || interaction.type !== event.type) {
    return { status: 'ignore' };
  }

  if (!eventsMatch(interaction, event)) {
    return { status: 'failure', step };
  }

  if (completedStepIds.includes(step.id)) {
    return { status: 'ignore' };
  }

  return {
    status: 'match',
    step,
    completedStepIds: [...completedStepIds, step.id],
  };
}

export type TrainingCoachRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type TrainingCoachPoint = {
  x: number;
  y: number;
};

const COACH_VIEWPORT_MARGIN = 16;

function rectsOverlap(
  panel: TrainingCoachRect,
  reserved: TrainingCoachRect,
): boolean {
  return (
    panel.left < reserved.right &&
    panel.right > reserved.left &&
    panel.top < reserved.bottom &&
    panel.bottom > reserved.top
  );
}

/**
 * Places the coach below the reserved rows (the first competitor rows) when it fits.
 * Falls back to the bottom of the viewport only when those rows are not on screen.
 */
export function placeTrainingCoach(options: {
  viewportWidth: number;
  viewportHeight: number;
  panelWidth: number;
  panelHeight: number;
  reservedRects: readonly TrainingCoachRect[];
}): TrainingCoachPoint {
  const { viewportWidth, viewportHeight, panelWidth, panelHeight, reservedRects } = options;
  const margin = COACH_VIEWPORT_MARGIN;
  const maxX = Math.max(margin, viewportWidth - panelWidth - margin);
  const x = Math.min(maxX, Math.max(margin, (viewportWidth - panelWidth) / 2));
  const bottomY = Math.max(margin, viewportHeight - panelHeight - margin);

  if (reservedRects.length === 0) {
    return { x, y: bottomY };
  }

  const reservedBottom = Math.max(...reservedRects.map((rect) => rect.bottom));
  const belowRows = reservedBottom + 12;
  const panelAt = (y: number): TrainingCoachRect => ({
    left: x,
    top: y,
    right: x + panelWidth,
    bottom: y + panelHeight,
  });
  const coversReserved = (y: number) =>
    reservedRects.some((rect) => rectsOverlap(panelAt(y), rect));

  if (!coversReserved(belowRows)) {
    return { x, y: belowRows };
  }

  if (!coversReserved(bottomY)) {
    return { x, y: bottomY };
  }

  return { x, y: belowRows };
}

export function filterKnownCompletedStepIds(
  lesson: TrainingLesson,
  completedStepIds: readonly string[],
): string[] {
  const known = new Set(lesson.steps.map((step) => step.id));
  return completedStepIds.filter((id) => known.has(id));
}
