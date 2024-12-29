import React, { useState } from 'react';
import { GameCard } from './components/GameCard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { PlayerSetup } from './components/PlayerSetup';
import { ScoreBoard } from './components/ScoreBoard';
import { Leaderboard } from './components/Leaderboard';
import { Player } from './types';
import { GameMode } from './types/game';
import { avatars } from './data/avatars';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useGame } from './hooks/useGame';

interface GameState {
  player: Player;
  mode: GameMode;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { entries: leaderboard, loading: leaderboardLoading, addEntry } = useLeaderboard();
  const { currentQuestion, gameStats, gameOver, handleAnswer, resetGame, settings } = useGame(
    gameState?.mode || 'easy'
  );

  const handlePlayerSetup = (player: Player, mode: GameMode) => {
    setGameState({ player, mode });
  };

  const handlePlayerAnswer = async (answer: boolean) => {
    const isGameOver = await handleAnswer(answer);
    if (isGameOver && gameState) {
      await addEntry({
        playerName: gameState.player.name,
        avatarId: gameState.player.avatarId,
        score: gameStats.totalPoints,
        averageResponseTime: gameStats.averageResponseTime
      });
    }
  };

  const handleNewPlayer = () => {
    setGameState(null);
    resetGame();
  };

  const avatarUrl = gameState?.player 
    ? (avatars.find(a => a.id === gameState.player.avatarId)?.url || avatars[0].url) 
    : '';

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-8 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="flex flex-col items-center w-full max-w-5xl mx-auto relative">
        {gameState && (
          <div className="w-full flex justify-between items-start mb-8 gap-4">
            {!leaderboardLoading && (
              <div className="hidden md:block absolute left-4">
                <Leaderboard entries={leaderboard.slice(0, 5)} />
              </div>
            )}
            <div className="absolute right-4">
              <ScoreBoard
                stats={gameStats}
                playerName={gameState.player.name}
                avatarUrl={avatarUrl}
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-md mx-auto mt-20 md:mt-16">
          {!gameState ? (
            <PlayerSetup onComplete={handlePlayerSetup} />
          ) : (
            <GameCard
              gameOver={gameOver}
              score={gameStats.totalPoints}
              questionCount={gameStats.totalQuestions}
              currentQuestion={currentQuestion}
              onAnswer={handlePlayerAnswer}
              onRestart={resetGame}
              onNewPlayer={handleNewPlayer}
              settings={settings}
            />
          )}
        </div>

        {gameState && gameOver && !leaderboardLoading && (
          <div className="mt-6 w-full max-w-md mx-auto md:hidden">
            <Leaderboard entries={leaderboard.slice(0, 5)} />
          </div>
        )}
      </div>
    </div>
  );
}