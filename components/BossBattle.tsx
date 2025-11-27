import React, { useState } from 'react';
import { Boss, PlayerStats } from '../types';
import { CHARIZARD_MOVES, DIALGA_CONFIG } from '../constants';
import { HealthBar } from './HealthBar';

interface BossBattleProps {
  boss: Boss;
  playerStats: PlayerStats;
  moveUsage: Record<string, number>;
  onAttack: (moveId: string) => void;
  isPlayerTurn: boolean;
  battleLog: string[];
}

export const BossBattle: React.FC<BossBattleProps> = ({ boss, playerStats, moveUsage, onAttack, isPlayerTurn, battleLog }) => {
  
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
      {/* Battle Arena */}
      <div className="flex-1 flex flex-col md:flex-row justify-between items-center gap-8 mb-6 relative">
        
        {/* Boss Display (Top/Right) */}
        <div className="flex flex-col items-center order-1 md:order-2 w-full md:w-1/2">
           <div className="w-full max-w-xs mb-2">
            <HealthBar current={boss.hp} max={boss.maxHp} label={DIALGA_CONFIG.name} color="bg-purple-600" />
           </div>
           <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img src={DIALGA_CONFIG.sprite} alt="Dialga" className="w-full h-full object-contain drop-shadow-2xl animate-pulse-slow" />
           </div>
        </div>

        {/* Player Display is handled by parent App layout, but we need move controls here */}
        <div className="w-full md:w-1/2 order-2 md:order-1 bg-black/30 p-4 rounded-xl h-64 overflow-y-auto border border-gray-700 font-mono text-sm shadow-inner">
            {battleLog.length === 0 ? (
                <div className="text-gray-500 italic">배틀이 시작되었습니다!</div>
            ) : (
                battleLog.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                ))
            )}
            <div id="log-end"></div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800/90 border-t-4 border-gray-600 p-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <h3 className="text-xl font-bold mb-4 text-white">공격 스킬 선택 {isPlayerTurn ? '' : '(상대 턴...)'}</h3>
        <div className="grid grid-cols-2 gap-4">
          {CHARIZARD_MOVES.map((move) => {
            const uses = moveUsage[move.id] || 0;
            const remaining = move.maxUses - uses;
            const disabled = !isPlayerTurn || (move.maxUses !== Infinity && remaining <= 0);

            return (
              <button
                key={move.id}
                onClick={() => onAttack(move.id)}
                disabled={disabled}
                className={`
                  relative p-4 rounded-xl text-left border-2 transition-all
                  ${disabled 
                    ? 'bg-gray-700 border-gray-600 text-gray-500 opacity-50 cursor-not-allowed' 
                    : move.type === 'special' 
                        ? 'bg-red-900/40 border-red-500 hover:bg-red-800 hover:scale-[1.02] active:scale-95' 
                        : 'bg-gray-700/40 border-gray-400 hover:bg-gray-600 hover:scale-[1.02] active:scale-95'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{move.name}</span>
                    <span className="text-xs bg-black/50 px-2 py-1 rounded">Dmg: {move.damage}</span>
                </div>
                <div className="text-xs mt-1 text-gray-300">
                    {move.maxUses === Infinity ? '∞' : `남은 횟수: ${remaining}/${move.maxUses}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};