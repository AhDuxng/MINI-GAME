// Phòng chờ Ma Sói: mã phòng và link mời, danh sách người đã vào kèm trạng thái online, cài đặt bộ vai, trò chuyện và nút bắt đầu cho chủ phòng
'use client';

import { useState } from 'react';
import { FaCheck, FaLink, FaPlay, FaShareNodes, FaUserMinus } from 'react-icons/fa6';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { ActionBar, GameLayout, GameStage } from '@/games/kit';
import { MAX_PLAYERS, MIN_PLAYERS, effectiveSetup, setupProblem } from '../engine/setup';
import type { Action, RoomView } from '../engine/types';
import ChatBox from './ChatBox';
import LobbySettings from './LobbySettings';
import PlayerGrid from './PlayerGrid';

interface LobbyProps {
  view: RoomView;
  online: string[];
  busy: boolean;
  send: (action: Action) => Promise<boolean>;
  onLeave: () => void;
}

function inviteLink(code: string) {
  return `${window.location.origin}/game/werewolf?room=${code}`;
}

export default function Lobby({ view, online, busy, send, onLeave }: LobbyProps) {
  const [copied, setCopied] = useState(false);
  const isHost = view.me?.isHost === true;
  const count = view.players.length;
  const problem = setupProblem(effectiveSetup(view.settings, count), count);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink(view.code));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = () => navigator.share({ title: 'Vào làng Ma Sói', text: `Vào phòng Ma Sói, mã ${view.code}`, url: inviteLink(view.code) }).catch(() => undefined);

  const leave = async () => {
    if (await send({ type: 'leave' })) onLeave();
  };

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="night" className="p-5 sm:p-6">
            <p className="eyebrow mb-3">Mã phòng, gửi cho cả nhóm</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1.5" aria-label={`Mã phòng ${view.code}`}>
                {view.code.split('').map((letter, index) => (
                  <span key={index} className="flex h-14 w-11 animate-tile-drop items-center justify-center border-2 border-edge bg-elevated font-display text-3xl font-extrabold text-ink sm:h-16 sm:w-12 rounded-xl" style={{ animationDelay: `${index * 70}ms` }}>
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                <Button variant="secondary" onClick={copy} className="flex-1 sm:flex-none">
                  {copied ? <FaCheck className="h-4 w-4 text-ramp-text-8" /> : <FaLink className="h-4 w-4" />}
                  {copied ? 'Đã sao chép' : 'Sao chép link'}
                </Button>
                {canShare && (
                  <Button variant="secondary" onClick={share} className="flex-1 sm:flex-none">
                    <FaShareNodes className="h-4 w-4" /> Chia sẻ
                  </Button>
                )}
              </div>
            </div>
          </GameStage>

          <Panel title={`Dân làng đã tới · ${count}/${MAX_PLAYERS}`} stop={8}>
            <PlayerGrid
              players={view.players}
              online={online.length > 0 ? online : undefined}
              note={(player) =>
                isHost && !player.isMe ? (
                  <button type="button" onClick={() => void send({ type: 'kick', playerId: player.id })} className="flex items-center gap-1 text-muted hover:text-ramp-text-3">
                    <FaUserMinus className="h-3 w-3" /> Mời ra
                  </button>
                ) : null
              }
            />
            {count < MIN_PLAYERS && <p className="mt-3 text-sm text-muted">Cần thêm {MIN_PLAYERS - count} người nữa để bắt đầu.</p>}
          </Panel>

          <ActionBar>
            {isHost ? (
              <Button size="lg" onClick={() => void send({ type: 'start' })} disabled={busy || problem !== null}>
                <FaPlay className="h-4 w-4" /> Bắt đầu ván
              </Button>
            ) : (
              <>
                <Button size="lg" variant="secondary" onClick={leave} disabled={busy}>
                  Rời phòng
                </Button>
                <span className="flex items-center justify-center text-center text-sm font-semibold text-muted">Chờ chủ phòng bắt đầu...</span>
              </>
            )}
          </ActionBar>
        </>
      }
      aside={
        <>
          <LobbySettings view={view} onChange={(settings) => void send({ type: 'settings', settings })} />
          <ChatBox messages={view.chat} players={view.players} channel={view.me?.chat ?? null} onSend={(text) => send({ type: 'chat', text })} />
        </>
      }
    />
  );
}
