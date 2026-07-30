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

export type PendingAttachment = {
  type: 'image' | 'file';
  uri: string;
  name: string;
  size?: string;
  mimeType?: string;
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'advisor';
  text?: string;
  time: string;
  image?: string;
  file?: { name: string; size: string; mimeType?: string };
  replyTo?: { text: string; from: string };
  reactions?: string[];
};
