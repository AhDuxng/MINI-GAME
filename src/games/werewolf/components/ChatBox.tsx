// Khung trò chuyện trong phòng: kênh chung, kênh riêng của bầy sói ban đêm và kênh hồn ma cho người đã chết, tự cuộn tới tin mới nhất
'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';
import Panel from '@/shared/ui/Panel';
import { rampText } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { CHAT_MAX } from '../engine/setup';
import type { ChatChannel, ChatMessage, PlayerView } from '../engine/types';

const CHANNEL_LABELS: Record<ChatChannel, string> = { all: '', wolves: 'Bầy sói', dead: 'Hồn ma' };
const CHANNEL_HINTS: Record<ChatChannel, string> = {
  all: 'Nhắn cho cả làng...',
  wolves: 'Bàn kế với bầy sói...',
  dead: 'Thì thầm với các hồn ma...',
};

interface ChatBoxProps {
  messages: ChatMessage[];
  players: PlayerView[];
  channel: ChatChannel | null;
  onSend: (text: string) => Promise<boolean>;
  title?: string;
  className?: string;
}

export default function ChatBox({ messages, players, channel, onSend, title = 'Trò chuyện', className }: ChatBoxProps) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const lastId = messages.at(-1)?.id;

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [lastId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !channel || sending) return;
    setSending(true);
    if (await onSend(text)) setDraft('');
    setSending(false);
  };

  const sender = (id: string) => players.find((player) => player.id === id);

  return (
    <Panel title={title} stop={6} className={className}>
      <ol ref={list} className="scrollbar-soft -mx-1 mb-3 max-h-64 min-h-[96px] space-y-2 overflow-y-auto px-1">
        {messages.length === 0 && <li className="py-6 text-center text-sm text-muted">Chưa có tin nhắn nào.</li>}
        {messages.map((message) => {
          const author = sender(message.from);
          return (
            <li key={message.id} className={cn('text-sm leading-snug', message.channel !== 'all' && 'border-l-2 border-edge pl-2')}>
              {message.channel !== 'all' && <span className="mr-1.5 text-xs font-extrabold uppercase tracking-wider text-ramp-text-3">{CHANNEL_LABELS[message.channel]}</span>}
              <span className="font-display font-bold" style={{ color: rampText(author?.seat ?? 0) }}>
                {author?.name ?? 'Ai đó'}
              </span>
              <span className="text-muted">: </span>
              <span className="break-words text-ink">{message.text}</span>
            </li>
          );
        })}
      </ol>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={CHAT_MAX}
          disabled={!channel}
          placeholder={channel ? CHANNEL_HINTS[channel] : 'Ban đêm cả làng phải ngủ'}
          aria-label="Nội dung tin nhắn"
          className="field h-11 min-w-0 flex-1"
        />
        <button type="submit" disabled={!channel || !draft.trim() || sending} aria-label="Gửi" className="fill-ramp flex h-11 w-11 flex-shrink-0 items-center justify-center disabled:opacity-40 rounded-lg">
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </form>
    </Panel>
  );
}
