// Màn chơi Nối từ: chuyển giữa màn thiết lập và ván đang chơi, công bố người thắng khi chỉ còn một người
'use client';

import { useEffect, useState } from 'react';
import ResultModal from '@/shared/ui/ResultModal';
import { usePlayers } from '@/features/players';
import useWordChain from './useWordChain';
import WordChainBoard from './WordChainBoard';
import WordChainSetup from './WordChainSetup';

export default function WordChainGame() {
  const { players } = usePlayers();
  const game = useWordChain(players);
  const [resultOpen, setResultOpen] = useState(false);
  const finished = game.state.phase === 'finished';

  useEffect(() => {
    setResultOpen(finished);
  }, [finished]);

  if (game.state.phase === 'setup') {
    return (
      <WordChainSetup
        mode={game.settings.mode}
        turnSeconds={game.settings.turnSeconds}
        onChange={game.setSettings}
        playerCount={players.length}
        onStart={game.start}
      />
    );
  }

  const wordCount = game.state.words.filter((entry) => entry.player !== null).length;

  return (
    <>
      <WordChainBoard
        state={game.state}
        currentWord={game.currentWord}
        currentPlayer={game.currentPlayer}
        winner={game.winner}
        timeLeftMs={game.timeLeftMs}
        onSubmit={game.submit}
        onSurrender={game.surrender}
        onVeto={game.veto}
        onTogglePause={game.togglePause}
        onRestart={game.start}
        onExit={game.exit}
      />
      <ResultModal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title="vua nối từ"
        subtitle="Người trụ lại cuối cùng là:"
        result={game.winner}
        detail={<p>Cả bàn đã nói được {wordCount} từ hợp lệ.</p>}
        actions={[
          { label: 'Chơi lại', onClick: game.start },
          { label: 'Đổi thiết lập', onClick: game.exit, variant: 'secondary' },
        ]}
      />
    </>
  );
}
