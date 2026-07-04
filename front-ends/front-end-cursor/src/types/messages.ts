export type MessageType = 'success' | 'warning' | 'problem' | 'info';

export type AppMessage = {
  id: string;
  type: MessageType;
  text: string;
};

export type NewAppMessage = {
  type: MessageType;
  text: string;
};
