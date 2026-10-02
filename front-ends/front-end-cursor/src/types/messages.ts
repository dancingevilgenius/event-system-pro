export type MessageType = 'success' | 'warning' | 'problem' | 'info';

export type AppMessage = {
  id: string;
  type: MessageType;
  text: string;
  /** When true, message does not auto-dismiss and survives clearMessages(). */
  sticky?: boolean;
};

export type NewAppMessage = {
  type: MessageType;
  text: string;
  sticky?: boolean;
};

export type ShowMessageOptions = {
  sticky?: boolean;
  /** Use a fixed id so re-showing replaces/updates instead of duplicating. */
  id?: string;
};
