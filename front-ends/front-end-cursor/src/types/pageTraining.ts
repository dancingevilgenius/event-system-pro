export type TrainingClickInteraction = {
  type: 'click';
  elementId: string;
};

export type TrainingSelectInteraction = {
  type: 'select';
  elementId: string;
  option: string;
};

export type TrainingInteraction = TrainingClickInteraction | TrainingSelectInteraction;

export type TrainingStep = {
  id: string;
  instruction: string;
  successMessage: string;
  failureMessage: string;
  interaction: TrainingInteraction;
};

export type TrainingLesson = {
  instructionCode: string;
  pagePath: string;
  title: string;
  fromPage: string;
  steps: TrainingStep[];
};

export type TrainingSelectReport = 'keep' | 'revert';
