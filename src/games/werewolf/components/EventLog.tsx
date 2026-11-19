// Nhật ký làng: kể lại từng đêm ai chết, từng ngày ai bị treo cổ và phát súng của Thợ Săn, mới nhất ở trên
import { GiCrossbow, GiDeathSkull, GiMoon, GiSunrise } from 'react-icons/gi';
import Panel from '@/shared/ui/Panel';
import { ROLES } from '../engine/roles';
import type { GameEvent, PlayerView } from '../engine/types';

export function nameWithRole(players: PlayerView[], id: string) {
  const player = players.find((item) => item.id === id);
  if (!player) return 'Ai đó';
  return player.role ? `${player.name} (${ROLES[player.role].name})` : player.name;
}

export function describeEvent(event: GameEvent, players: PlayerView[]) {
  const named = (id: string) => nameWithRole(players, id);
  switch (event.kind) {
    case 'night':
      return event.deaths.length === 0
        ? `Đêm ${event.round}: làng yên bình, không ai chết.`
        : `Đêm ${event.round}: ${event.deaths.map(named).join(', ')} đã chết.`;
    case 'lynch':
      return event.targetId ? `Ngày ${event.round}: làng treo cổ ${named(event.targetId)}.` : `Ngày ${event.round}: không ai bị treo cổ.`;
    case 'shot':
      return event.targetId ? `Thợ Săn ${named(event.hunterId)} bắn chết ${named(event.targetId)}.` : `Thợ Săn ${named(event.hunterId)} không bắn ai.`;
    default:
      return '';
  }
}

const EVENT_ICONS = { night: GiMoon, lynch: GiSunrise, shot: GiCrossbow };

export default function EventLog({ events, players }: { events: GameEvent[]; players: PlayerView[] }) {
  return (
    <Panel title="Nhật ký làng" stop={5}>
      {events.length === 0 ? (
        <p className="text-sm text-muted">Chưa có chuyện gì xảy ra.</p>
      ) : (
        <ol className="space-y-2.5">
          {[...events].reverse().map((event, index) => {
            const Icon = EVENT_ICONS[event.kind];
            const deadly = (event.kind === 'night' && event.deaths.length > 0) || (event.kind !== 'night' && event.targetId);
            return (
              <li key={`${event.kind}-${event.round}-${index}`} className="flex gap-2.5 text-sm text-ink">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center bg-elevated text-muted rounded-md">
                  {deadly ? <GiDeathSkull className="h-4 w-4 text-ramp-text-3" /> : <Icon className="h-4 w-4" />}
                </span>
                {describeEvent(event, players)}
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
