import { describe, expect, it } from 'vitest';
import {
  applyTrainingEvent,
  currentTrainingStep,
  isCoachEnabled,
  parseTrainingLesson,
  placeTrainingCoach,
  readCompletedStepIds,
  trainingPercent,
  trainingProgressLabel,
  writeCompletedStepIds,
} from './pageTraining';
import type { TrainingLesson } from '../types/pageTraining';

const lessonJson = {
  page: '/prelims',
  fromPage: '/staff',
  title: 'All-American Prelims',
  steps: [
    {
      id: 'mark-yes',
      instruction: 'Choose Yes.',
      successMessage: 'Yes mark recorded.',
      failureMessage: 'Choose Yes.',
      interaction: { type: 'select', elementId: 'prelims-mark-first', option: 'yes' },
    },
    {
      id: 'filter-yes',
      instruction: 'Click the Yes filter.',
      successMessage: 'Showing couples marked Yes.',
      failureMessage: 'Click the Yes filter.',
      interaction: { type: 'click', elementId: 'prelims-filter-yes' },
    },
  ],
};

function lesson(): TrainingLesson {
  const parsed = parseTrainingLesson(lessonJson, 'PRELIMS_MARKS', '/prelims');
  if (!parsed) {
    throw new Error('fixture lesson failed to parse');
  }
  return parsed;
}

describe('isCoachEnabled', () => {
  it('accepts only coach=1', () => {
    expect(isCoachEnabled('?coach=1')).toBe(true);
    expect(isCoachEnabled('coach=1')).toBe(true);
    expect(isCoachEnabled('')).toBe(false);
    expect(isCoachEnabled('?coach=0')).toBe(false);
    expect(isCoachEnabled('?coach=true')).toBe(false);
  });
});

describe('parseTrainingLesson', () => {
  it('parses click and select steps', () => {
    const parsed = lesson();
    expect(parsed.title).toBe('All-American Prelims');
    expect(parsed.fromPage).toBe('/staff');
    expect(parsed.steps).toHaveLength(2);
    expect(parsed.steps[0].interaction).toEqual({
      type: 'select',
      elementId: 'prelims-mark-first',
      option: 'yes',
    });
    expect(parsed.steps[1].interaction.type).toBe('click');
  });

  it('rejects a select step that has no option', () => {
    const parsed = parseTrainingLesson(
      {
        title: 'Broken',
        steps: [
          {
            id: 'mark-yes',
            instruction: 'Choose Yes.',
            successMessage: 'Yes.',
            failureMessage: 'No.',
            interaction: { type: 'select', elementId: 'prelims-mark-first' },
          },
        ],
      },
      'PRELIMS_MARKS',
      '/prelims',
    );
    expect(parsed).toBeNull();
  });
});

describe('applyTrainingEvent', () => {
  it('matches a select of the named option and advances', () => {
    const parsed = lesson();
    const result = applyTrainingEvent(parsed, [], {
      type: 'select',
      elementId: 'prelims-mark-first',
      option: 'yes',
    });

    expect(result.status).toBe('match');
    if (result.status !== 'match') {
      return;
    }
    expect(result.completedStepIds).toEqual(['mark-yes']);
    expect(currentTrainingStep(parsed, result.completedStepIds)?.id).toBe('filter-yes');
    expect(trainingPercent(parsed, result.completedStepIds)).toBe(50);
    expect(trainingProgressLabel(parsed, result.completedStepIds)).toBe('Training: 2 of 2');
  });

  it('fails a select of a different option and does not advance', () => {
    const parsed = lesson();
    const result = applyTrainingEvent(parsed, [], {
      type: 'select',
      elementId: 'prelims-mark-first',
      option: 'maybe',
    });

    expect(result).toEqual({
      status: 'failure',
      step: parsed.steps[0],
    });
    expect(currentTrainingStep(parsed, [])?.id).toBe('mark-yes');
  });

  it('matches a click on the named element', () => {
    const parsed = lesson();
    const result = applyTrainingEvent(parsed, ['mark-yes'], {
      type: 'click',
      elementId: 'prelims-filter-yes',
    });

    expect(result.status).toBe('match');
    if (result.status !== 'match') {
      return;
    }
    expect(result.completedStepIds).toEqual(['mark-yes', 'filter-yes']);
    expect(trainingPercent(parsed, result.completedStepIds)).toBe(100);
    expect(trainingProgressLabel(parsed, result.completedStepIds)).toBe('Training: 2 of 2');
  });

  it('ignores a click on a different element', () => {
    const parsed = lesson();
    const result = applyTrainingEvent(parsed, [], {
      type: 'click',
      elementId: 'prelims-filter-yes',
    });

    expect(result).toEqual({ status: 'ignore' });
  });
});

describe('placeTrainingCoach', () => {
  it('sits below the first two competitor rows', () => {
    const placed = placeTrainingCoach({
      viewportWidth: 800,
      viewportHeight: 900,
      panelWidth: 360,
      panelHeight: 220,
      reservedRects: [
        { left: 40, top: 200, right: 760, bottom: 240 },
        { left: 40, top: 248, right: 760, bottom: 288 },
      ],
    });

    expect(placed.y).toBeGreaterThanOrEqual(288);
    expect(placed.y + 220).toBeLessThanOrEqual(900);
  });

  it('stays below those rows when the viewport is short', () => {
    const placed = placeTrainingCoach({
      viewportWidth: 400,
      viewportHeight: 500,
      panelWidth: 360,
      panelHeight: 280,
      reservedRects: [
        { left: 16, top: 180, right: 384, bottom: 220 },
        { left: 16, top: 228, right: 384, bottom: 268 },
      ],
    });

    expect(placed.y).toBeGreaterThanOrEqual(268);
  });
});

describe('completed step storage', () => {
  it('round-trips completed step ids', () => {
    const storage = new Map<string, string>();
    const memoryStorage: Storage = {
      get length() {
        return storage.size;
      },
      clear: () => storage.clear(),
      getItem: (key) => storage.get(key) ?? null,
      key: (index) => [...storage.keys()][index] ?? null,
      removeItem: (key) => {
        storage.delete(key);
      },
      setItem: (key, value) => {
        storage.set(key, value);
      },
    };

    writeCompletedStepIds(memoryStorage, 'PRELIMS_MARKS', ['mark-yes']);
    expect(readCompletedStepIds(memoryStorage, 'PRELIMS_MARKS')).toEqual(['mark-yes']);
  });
});
