import { useContext } from 'react';
import { PageTrainingContext } from '../context/PageTrainingContext';

export function usePageTraining() {
  const context = useContext(PageTrainingContext);

  if (!context) {
    throw new Error('usePageTraining must be used within PageTrainingProvider');
  }

  return context;
}

export const trainingTargetSx = {
  outline: '2px solid',
  outlineColor: 'primary.main',
  outlineOffset: '2px',
  borderRadius: 1,
} as const;
