// Cài đặt ván trong phòng chờ: tự chia vai theo số người hoặc tự chọn số sói và các vai đặc biệt, thời gian thảo luận, lộ vai khi chết; người không phải chủ phòng chỉ xem
'use client';

import { FaMinus, FaPlus } from 'react-icons/fa6';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { cn } from '@/shared/lib/utils';
import { ROLES, SPECIAL_ROLES, type RoleId, type SpecialRole } from '../engine/roles';
import { DISCUSSION_OPTIONS, MAX_WOLVES, effectiveSetup, setupProblem } from '../engine/setup';
import type { RoomSettings, RoomView } from '../engine/types';
import { RoleIcon, RoleTag } from './role-art';

function Toggle({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-2 text-left disabled:cursor-default"
    >
      <span className="font-semibold text-ink">{label}</span>
      <span className={cn('relative h-7 w-12 flex-shrink-0 rounded-full transition-colors', checked ? 'bg-ramp-8' : 'bg-line')}>
        <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-canvas transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
      </span>
    </button>
  );
}

export default function LobbySettings({ view, onChange }: { view: RoomView; onChange: (settings: RoomSettings) => void }) {
  const { settings } = view;
  const editable = view.me?.isHost === true;
  const count = view.players.length;
  const setup = effectiveSetup(settings, count);
  const problem = setupProblem(setup, count);
  const update = (patch: Partial<RoomSettings>) => onChange({ ...settings, ...patch });
  const updateRoles = (patch: Partial<RoomSettings['roles']>) => update({ autoRoles: false, roles: { ...setup, ...patch } });
  const toggleRole = (role: SpecialRole) => {
    const roles = { ...setup };
    roles[role] = !roles[role];
    update({ autoRoles: false, roles });
  };

  return (
    <Panel title="Bộ vai và luật" stop={3} action={!editable ? <span className="text-xs font-bold text-muted">Chủ phòng chỉnh</span> : null}>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(Object.keys(view.roleCounts) as RoleId[])
          .filter((role) => view.roleCounts[role] > 0)
          .map((role) => (
            <RoleTag key={role} role={role} count={view.roleCounts[role]} />
          ))}
      </div>
      {problem && count >= 1 && <p className="mb-3 border-l-4 border-edge bg-elevated px-3 py-2 text-sm font-semibold text-ink">{problem}</p>}

      <div className="divide-y divide-line">
        <Toggle label="Tự chia vai theo số người" checked={settings.autoRoles} disabled={!editable} onChange={(value) => update({ autoRoles: value, roles: setup })} />

        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="flex items-center gap-2 font-semibold text-ink">
            <RoleIcon role="wolf" className="h-5 w-5 text-ramp-text-3" /> Số Ma Sói
          </span>
          <span className="flex items-center">
            <button type="button" aria-label="Bớt một sói" disabled={!editable || setup.wolves <= 1} onClick={() => updateRoles({ wolves: setup.wolves - 1 })} className="flex h-9 w-9 items-center justify-center border border-line text-ink disabled:opacity-30 rounded-lg">
              <FaMinus className="h-3 w-3" />
            </button>
            <span className="w-10 text-center font-display text-xl font-extrabold text-ink">{setup.wolves}</span>
            <button type="button" aria-label="Thêm một sói" disabled={!editable || setup.wolves >= MAX_WOLVES} onClick={() => updateRoles({ wolves: setup.wolves + 1 })} className="flex h-9 w-9 items-center justify-center border border-line text-ink disabled:opacity-30 rounded-lg">
              <FaPlus className="h-3 w-3" />
            </button>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3">
          {SPECIAL_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              disabled={!editable}
              aria-pressed={setup[role]}
              onClick={() => toggleRole(role)}
              className={cn('flex items-center gap-2 border-2 px-3 py-2 font-display text-sm font-bold transition-colors disabled:cursor-default rounded-xl', setup[role] ? 'border-edge bg-elevated text-ink' : 'border-line text-muted')}
            >
              <RoleIcon role={role} className="h-5 w-5" />
              {ROLES[role].name}
            </button>
          ))}
        </div>

        <div className="py-3">
          <SegmentedControl
            label="Thời gian thảo luận ban ngày"
            options={DISCUSSION_OPTIONS.map((value) => ({ value, label: `${value / 60} phút` }))}
            value={settings.discussionSeconds}
            onChange={(value) => update({ discussionSeconds: value })}
            disabled={!editable}
          />
        </div>

        <Toggle label="Lộ vai của người đã chết" checked={settings.revealRoleOnDeath} disabled={!editable} onChange={(value) => update({ revealRoleOnDeath: value })} />
      </div>
    </Panel>
  );
}
