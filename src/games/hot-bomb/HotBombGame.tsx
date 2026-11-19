// Màn chơi Bom Nổ Chậm: chủ đề, quả bom 3D, người đang cầm bom, nút chuyền trong tầm ngón cái, thiết lập ngòi và bảng bom nổ
'use client';

import { FaArrowRight, FaFire } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, RankingPanel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampWash } from '@/shared/lib/ramp';
import Bomb from './Bomb';
import { FUSES, type FuseId } from './fuses';
import useHotBomb from './useHotBomb';

const FUSE_OPTIONS = (Object.keys(FUSES) as FuseId[]).map((id) => ({ value: id, label: FUSES[id].label }));

export default function HotBombGame() {
  const { players } = usePlayers();
  const game = useHotBomb(players);
  const burning = game.phase === 'burning';
  const ranking = Object.entries(game.tally).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="danger" onTap={burning ? game.pass : game.light} className="overflow-hidden">
              <div className="border-b border-white/10 bg-black/40 px-5 pb-4 pt-6 text-center" style={{ background: game.topic ? rampWash(3, 22) : undefined }}>
                <p className="eyebrow">Chủ đề</p>
                <p className="mt-1 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  {game.topic ?? 'Bấm châm ngòi để nhận chủ đề'}
                </p>
              </div>

              <Bomb phase={game.phase} getHeat={game.getHeat} />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-5 pb-6 pt-4">
                <p className="font-semibold text-muted">
                  {burning ? 'Bom đang ở tay ' : game.phase === 'exploded' ? 'Bom nổ trên tay ' : 'Sẵn sàng châm ngòi'}
                  {game.phase !== 'idle' && <span className="text-ramp font-display text-2xl font-bold">{game.holderName ?? 'người cầm máy'}</span>}
                </p>
                {game.phase !== 'idle' && <Badge>Đã chuyền {game.passes} lần</Badge>}
              </div>
            </GameStage>

            <ActionBar>
              {burning ? (
                <Button size="lg" onClick={game.pass}>
                  Trả lời xong, chuyền bom
                  <FaArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="lg" onClick={game.light}>
                  <FaFire className="h-4 w-4" />
                  {game.phase === 'exploded' ? 'Châm ngòi ván mới' : 'Châm ngòi'}
                </Button>
              )}
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel title="Độ dài ngòi" stop={3}>
              <SegmentedControl label="Bom nổ ngẫu nhiên trong khoảng" options={FUSE_OPTIONS} value={game.fuseId} onChange={game.setFuseId} disabled={burning} />
              <p className="mt-3 text-xs font-semibold text-muted">Không ai biết bom nổ lúc nào, kể cả người châm ngòi.</p>
            </Panel>

            <RankingPanel title="Bảng bom nổ" stop={2} startStop={0} ranking={ranking} unit="lần" />

            <PlayerPanel disabled={burning} hint="Có từ 2 người trở lên, game sẽ báo bom đang ở tay ai và ai thua." />
          </>
        }
      />

      <ResultModal
        open={game.resultOpen}
        onClose={game.closeResult}
        title="BÙM!"
        subtitle="Bom nổ trên tay:"
        result={game.loser ?? 'Người đang cầm máy'}
        detail={
          <p>
            Hình phạt: <strong className="text-ramp-text-3">{game.punishment}</strong>
            <br />
            Bom đã được chuyền {game.passes} lần.
          </p>
        }
        actions={[
          { label: 'Châm ngòi ván mới', onClick: game.light },
          { label: 'Đóng', onClick: game.closeResult, variant: 'secondary' },
        ]}
      />
    </>
  );
}
