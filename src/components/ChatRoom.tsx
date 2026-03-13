import { useState, useEffect, useRef } from "react";
import {
  createMockChatService,
  type ChatMessage,
} from "../services/chatService";

const NICK_KEY = "chat-nickname";
const chatService = createMockChatService();

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

interface ChatRoomProps {
  onClose: () => void;
}

export function ChatRoom({ onClose }: ChatRoomProps) {
  const [nickname, setNickname] = useState(
    () => sessionStorage.getItem(NICK_KEY) || "",
  );
  const [nickInput, setNickInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nickInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!nickname) return;
    const unsub = chatService.subscribe(setMessages);
    return unsub;
  }, [nickname]);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (nickname) {
      inputRef.current?.focus();
    } else {
      nickInputRef.current?.focus();
    }
  }, [nickname]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleNickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nick = nickInput.trim();
    if (!nick) return;
    sessionStorage.setItem(NICK_KEY, nick);
    setNickname(nick);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (text.startsWith("/nick ")) {
      const newNick = text.slice(6).trim();
      if (newNick) {
        chatService.announce(
          `*** ${nickname} has changed their name to ${newNick}`,
        );
        sessionStorage.setItem(NICK_KEY, newNick);
        setNickname(newNick);
      }
      setInput("");
      return;
    }

    if (text === "/quit") {
      onClose();
      return;
    }

    chatService.send({ nickname, text });
    setInput("");
  };

  if (!nickname) {
    return (
      <div className="chat-room">
        <div className="terminal-content">
          <div className="chat-nick-prompt">
            <h2 className="section-title">CHAT</h2>
            <div className="section-divider">{"═".repeat(40)}</div>
            <p>enter your handle:</p>
            <form onSubmit={handleNickSubmit}>
              <input
                ref={nickInputRef}
                className="chat-nick-input"
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                maxLength={16}
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <div className="terminal-content chat-layout">
        <div className="chat-messages" ref={messagesRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message${msg.system ? " chat-system" : ""}`}
            >
              <span className="chat-timestamp">
                [{formatTime(msg.timestamp)}]
              </span>
              {msg.system ? (
                <span className="chat-text">{msg.text}</span>
              ) : (
                <>
                  <span className="chat-sender">&lt;{msg.nickname}&gt;</span>
                  <span className="chat-text">{msg.text}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <form className="chat-input-row" onSubmit={handleSend}>
          <span className="chat-input-prompt">&gt;&nbsp;</span>
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </form>
        <button className="music-back-button" onClick={onClose}>
          [ESC] BACK
        </button>
      </div>
    </div>
  );
}
