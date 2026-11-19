// Bộ vai Ma Sói: tên, phe, màu trên dải ramp, thứ tự thức dậy ban đêm và mô tả năng lực hiển thị cho người chơi
export type RoleId = 'wolf' | 'seer' | 'guard' | 'witch' | 'hunter' | 'villager';
export type Team = 'wolves' | 'village';
export type NightStep = 'guard' | 'wolves' | 'seer' | 'witch';
export type SpecialRole = 'seer' | 'guard' | 'witch' | 'hunter';

export interface RoleInfo {
  id: RoleId;
  name: string;
  team: Team;
  stop: number;
  summary: string;
  tip: string;
}

export const ROLES: Record<RoleId, RoleInfo> = {
  wolf: {
    id: 'wolf',
    name: 'Ma Sói',
    team: 'wolves',
    stop: 3,
    summary: 'Mỗi đêm cùng bầy thống nhất cắn một người.',
    tip: 'Bạn biết mặt đồng bọn. Ban ngày hãy đóng vai dân lành và đẩy nghi ngờ sang người khác.',
  },
  seer: {
    id: 'seer',
    name: 'Tiên Tri',
    team: 'village',
    stop: 5,
    summary: 'Mỗi đêm soi một người để biết người đó có phải sói không.',
    tip: 'Thông tin của bạn là vũ khí mạnh nhất của làng, nhưng lộ diện sớm sẽ bị sói cắn.',
  },
  guard: {
    id: 'guard',
    name: 'Bảo Vệ',
    team: 'village',
    stop: 7,
    summary: 'Mỗi đêm che chở một người khỏi nanh sói, không được giữ cùng một người hai đêm liền.',
    tip: 'Đoán xem sói muốn cắn ai và đứng chắn trước người đó.',
  },
  witch: {
    id: 'witch',
    name: 'Phù Thủy',
    team: 'village',
    stop: 4,
    summary: 'Có một bình cứu người bị cắn và một bình độc giết người, mỗi bình dùng một lần cả ván.',
    tip: 'Bạn thấy ai bị sói cắn mỗi đêm. Dùng bình đúng lúc có thể lật ngược ván đấu.',
  },
  hunter: {
    id: 'hunter',
    name: 'Thợ Săn',
    team: 'village',
    stop: 1,
    summary: 'Khi chết được bắn chết theo một người, trừ khi chết vì bình độc.',
    tip: 'Nếu bị treo cổ hay bị cắn, hãy kéo theo kẻ bạn nghi là sói nhất.',
  },
  villager: {
    id: 'villager',
    name: 'Dân Làng',
    team: 'village',
    stop: 8,
    summary: 'Không có năng lực đặc biệt, chỉ có lý lẽ và lá phiếu ban ngày.',
    tip: 'Lắng nghe, đặt câu hỏi và bỏ phiếu thật tỉnh táo.',
  },
};

export const SPECIAL_ROLES: SpecialRole[] = ['seer', 'guard', 'witch', 'hunter'];
export const NIGHT_ORDER: NightStep[] = ['guard', 'wolves', 'seer', 'witch'];

export const STEP_ROLE: Record<NightStep, RoleId> = {
  guard: 'guard',
  wolves: 'wolf',
  seer: 'seer',
  witch: 'witch',
};

export const TEAM_NAMES: Record<Team, string> = {
  wolves: 'Phe Sói',
  village: 'Phe Dân Làng',
};
