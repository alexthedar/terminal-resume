export interface ChatMessage {
  id: string;
  nickname: string;
  text: string;
  timestamp: number;
  system?: boolean;
}

export interface ChatService {
  subscribe(callback: (messages: ChatMessage[]) => void): () => void;
  send(message: { nickname: string; text: string }): void;
  announce(text: string): void;
}

const BOT_REPLIES = [
  "interesting...",
  "noted.",
  "tell me more.",
  "roger that.",
  "...",
  "copy.",
  "acknowledged.",
];

export function createMockChatService(): ChatService {
  const now = Date.now();
  const messages: ChatMessage[] = [
    {
      id: "1",
      nickname: "sysop",
      text: "*** channel #alexthedar opened",
      timestamp: now - 300000,
      system: true,
    },
    {
      id: "2",
      nickname: "sysop",
      text: "welcome. be cool.",
      timestamp: now - 240000,
    },
    {
      id: "3",
      nickname: "sysop",
      text: "type and hit enter.",
      timestamp: now - 180000,
    },
  ];
  const listeners = new Set<(messages: ChatMessage[]) => void>();

  function notify() {
    for (const cb of listeners) cb([...messages]);
  }

  return {
    subscribe(callback) {
      listeners.add(callback);
      callback([...messages]);
      return () => listeners.delete(callback);
    },
    send({ nickname, text }) {
      messages.push({
        id: crypto.randomUUID(),
        nickname,
        text,
        timestamp: Date.now(),
      });
      notify();

      // Bot reply after a delay
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        messages.push({
          id: crypto.randomUUID(),
          nickname: "sysop",
          text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
          timestamp: Date.now(),
        });
        notify();
      }, delay);
    },
    announce(text) {
      messages.push({
        id: crypto.randomUUID(),
        nickname: '',
        text,
        timestamp: Date.now(),
        system: true,
      });
      notify();
    },
  };
}
