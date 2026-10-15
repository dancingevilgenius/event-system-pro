import { createContext } from 'react';
import type { TrainingSelectReport } from '../types/pageTraining';

export type PageTrainingContextValue = {
  coachVisible: boolean;
  instructionText: string;
  progressPercent: number;
  progressLabel: string;
  /** Increments each time Restart is used so the host page can restore its own controls. */
  restartNonce: number;
  restartLesson: () => void;
  trainingDisabled: (elementId?: string) => boolean;
  isTrainingTarget: (elementId: string) => boolean;
  reportSelect: (elementId: string, option: string) => TrainingSelectReport;
  reportDrag: (elementId: string, moved: boolean) => void;
};

export const PageTrainingContext = createContext<PageTrainingContextValue | null>(null);
