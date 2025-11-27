import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
  onRestart: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentScore, onRestart }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/90 border border-yellow-500/50 p-8 rounded-2xl shadow-2xl text-center animate-fade-in-up">
      <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-yellow-400 mb-2">명예의 전당</h2>
      <p className="text-gray-400 mb-6">Top 10 Dragon Masters</p>

      {currentScore !== undefined && (
        <div className="bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-500/30">
          <p className="text-sm text-blue-300">당신의 점수</p>
          <p className="text-4xl font-bold text-white">{Math.floor(currentScore).toLocaleString()}</p>
        </div>
      )}

      <div className="space-y-2 mb-8 max-h-64 overflow-y-auto custom-scrollbar">
        {entries.length === 0 ? (
            <div className="text-gray-500 py-4">아직 기록이 없습니다.</div>
        ) : (
            entries.map((entry, index) => (
            <div key={index} className="flex justify-between items-center bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                <span className={`
                    w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                    ${index === 0 ? 'bg-yellow-400 text-black' : 
                      index === 1 ? 'bg-gray-300 text-black' : 
                      index === 2 ? 'bg-amber-600 text-black' : 'bg-gray-700 text-gray-300'}
                `}>
                    {index + 1}
                </span>
                <span className="font-semibold truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="font-mono text-yellow-200">{Math.floor(entry.score).toLocaleString()}</span>
            </div>
            ))
        )}
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1"
      >
        다시 시작하기
      </button>
    </div>
  );
};