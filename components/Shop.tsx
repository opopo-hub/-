import React from 'react';
import { PlayerStats } from '../types';
import { SHOP_CONFIG } from '../constants';

interface ShopProps {
  stats: PlayerStats;
  onBuy: () => void;
  onUse: () => void;
}

export const Shop: React.FC<ShopProps> = ({ stats, onBuy, onUse }) => {
  const canBuy = stats.score >= SHOP_CONFIG.berryCost;
  const canUse = stats.inventory.oranBerry > 0 && stats.hp < stats.maxHp;

  return (
    <div className="flex gap-2 mt-4 p-3 bg-black/40 rounded-lg backdrop-blur-sm border border-yellow-500/30">
      <div className="flex flex-col items-center border-r border-gray-600 pr-4 mr-2">
        <span className="text-yellow-400 font-bold text-lg">{Math.floor(stats.score)} PT</span>
        <span className="text-xs text-gray-400">보유 포인트</span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onBuy}
          disabled={!canBuy}
          className={`px-3 py-1 rounded text-sm font-bold flex flex-col items-center transition-colors
            ${canBuy ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          <span>구매 (100pt)</span>
          <span className="text-xs font-normal">오랑열매 +1</span>
        </button>

        <button
          onClick={onUse}
          disabled={!canUse}
          className={`px-3 py-1 rounded text-sm font-bold flex flex-col items-center transition-colors
            ${canUse ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          <span>사용 ({stats.inventory.oranBerry})</span>
          <span className="text-xs font-normal">HP 50% 회복</span>
        </button>
      </div>
    </div>
  );
};