export type ChatThread = {
  id: string;
  name: string;
  desk: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'advisor';
  text?: string;
  time: string;
  file?: { name: string; size: string };
};
