export type ChatContext = {
  type: 'service' | 'opportunity';
  id: string;
  label: string;
};

export type ChatThread = {
  id: string;
  name: string;
  desk: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  context?: ChatContext;
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'advisor';
  text?: string;
  time: string;
  file?: { name: string; size: string };
  replyTo?: { text: string; from: string };
};
