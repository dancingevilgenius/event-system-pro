import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchTrainingLesson } from '../api/postgrest';
import PageTrainingCoach from '../components/PageTrainingCoach';
import { useMessages } from '../hooks/useMessages';
import {
  TRAINING_COMPLETE_TEXT,
  applyTrainingEvent,
  clearCompletedStepIds,
  currentTrainingStep,
  filterKnownCompletedStepIds,
  isCoachEnabled,
  readCompletedStepIds,
  trainingPercent,
  trainingProgressLabel,
  writeCompletedStepIds,
} from '../lib/pageTraining';
import type { TrainingLesson, TrainingSelectReport, TrainingStep } from '../types/pageTraining';
import { PageTrainingContext } from './PageTrainingContext';

type PageTrainingProviderProps = {
  children: ReactNode;
};

function elementIdFromClick(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const owned = target.closest('[id]');
  if (!(owned instanceof HTMLElement) || owned.id === '') {
    return null;
  }

  if (owned instanceof HTMLButtonElement && owned.disabled) {
    return null;
  }

  return owned.id;
}

export default function PageTrainingProvider({ children }: PageTrainingProviderProps) {
  const location = useLocation();
  const { showSuccess, showProblem } = useMessages();
  const coachEnabled = isCoachEnabled(location.search);
  const pagePath = location.pathname;
  const [lesson, setLesson] = useState<TrainingLesson | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [restartNonce, setRestartNonce] = useState(0);
  const snapshotRef = useRef({
    coachEnabled,
    lesson,
    completedStepIds,
  });

  snapshotRef.current = { coachEnabled, lesson, completedStepIds };

  useEffect(() => {
    if (!coachEnabled) {
      setLesson(null);
      setCompletedStepIds([]);
      return;
    }

    let cancelled = false;

    fetchTrainingLesson(pagePath)
      .then((nextLesson) => {
        if (cancelled) {
          return;
        }

        setLesson(nextLesson);
        setCompletedStepIds(
          nextLesson
            ? filterKnownCompletedStepIds(
                nextLesson,
                readCompletedStepIds(localStorage, nextLesson.instructionCode),
              )
            : [],
        );
      })
      .catch(() => {
        if (!cancelled) {
          setLesson(null);
          setCompletedStepIds([]);
          showProblem('Training lesson could not be loaded.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [coachEnabled, pagePath, showProblem]);

  const currentStep = lesson ? currentTrainingStep(lesson, completedStepIds) : null;
  const lessonComplete = Boolean(lesson && !currentStep);

  const acceptMatch = useCallback(
    (activeLesson: TrainingLesson, step: TrainingStep, nextCompleted: string[]) => {
      setCompletedStepIds(nextCompleted);
      writeCompletedStepIds(localStorage, activeLesson.instructionCode, nextCompleted);
      showSuccess(step.successMessage);
    },
    [showSuccess],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const snapshot = snapshotRef.current;
      if (!snapshot.coachEnabled || !snapshot.lesson) {
        return;
      }

      const elementId = elementIdFromClick(event.target);
      if (!elementId) {
        return;
      }

      const result = applyTrainingEvent(snapshot.lesson, snapshot.completedStepIds, {
        type: 'click',
        elementId,
      });

      if (result.status === 'match') {
        const matchedLesson = snapshot.lesson;
        const matchedStep = result.step;
        const nextCompleted = result.completedStepIds;
        // Let the clicked control update page state before this step disables it.
        queueMicrotask(() => {
          acceptMatch(matchedLesson, matchedStep, nextCompleted);
        });
      }
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [acceptMatch]);

  const trainingDisabled = useCallback(
    (elementId?: string) => {
      if (!coachEnabled || !lesson || lessonComplete || !currentStep) {
        return false;
      }

      if (!elementId) {
        return true;
      }

      return elementId !== currentStep.interaction.elementId;
    },
    [coachEnabled, currentStep, lesson, lessonComplete],
  );

  const isTrainingTarget = useCallback(
    (elementId: string) => {
      if (!coachEnabled || !currentStep || lessonComplete) {
        return false;
      }

      return currentStep.interaction.elementId === elementId;
    },
    [coachEnabled, currentStep, lessonComplete],
  );

  const reportSelect = useCallback(
    (elementId: string, option: string): TrainingSelectReport => {
      if (!coachEnabled || !lesson || lessonComplete) {
        return 'keep';
      }

      const result = applyTrainingEvent(lesson, completedStepIds, {
        type: 'select',
        elementId,
        option,
      });

      if (result.status === 'failure') {
        showProblem(result.step.failureMessage);
        return 'revert';
      }

      if (result.status === 'match') {
        acceptMatch(lesson, result.step, result.completedStepIds);
        return 'keep';
      }

      if (trainingDisabled(elementId)) {
        return 'revert';
      }

      return 'keep';
    },
    [acceptMatch, coachEnabled, completedStepIds, lesson, lessonComplete, showProblem, trainingDisabled],
  );

  const restartLesson = useCallback(() => {
    if (!lesson) {
      return;
    }

    clearCompletedStepIds(localStorage, lesson.instructionCode);
    setCompletedStepIds([]);
    setRestartNonce((current) => current + 1);
  }, [lesson]);

  const value = useMemo(
    () => ({
      coachVisible: Boolean(coachEnabled && lesson),
      instructionText: lessonComplete ? TRAINING_COMPLETE_TEXT : (currentStep?.instruction ?? ''),
      progressPercent: lesson ? trainingPercent(lesson, completedStepIds) : 0,
      progressLabel: lesson ? trainingProgressLabel(lesson, completedStepIds) : 'Training: 0 of 0',
      restartNonce,
      restartLesson,
      trainingDisabled,
      isTrainingTarget,
      reportSelect,
    }),
    [
      coachEnabled,
      completedStepIds,
      currentStep,
      isTrainingTarget,
      lesson,
      lessonComplete,
      reportSelect,
      restartNonce,
      restartLesson,
      trainingDisabled,
    ],
  );

  return (
    <PageTrainingContext.Provider value={value}>
      {children}
      <PageTrainingCoach />
    </PageTrainingContext.Provider>
  );
}
