import React from 'react';
import { Pokemon, PlayerStats } from '../types';
import { POKEMON_CONFIG } from '../constants';
import { HealthBar } from './HealthBar';

interface PokemonDisplayProps {
  pokemon: Pokemon;
  stats: PlayerStats;
  isHit?: boolean;
  attackAnimation?: boolean;
}

export const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon, stats, isHit, attackAnimation }) => {
  const config = POKEMON_CONFIG[pokemon.stage];
  const spriteUrl = pokemon.isShiny ? config.shinySprite : config.sprite;
  
  // Apply wind animation only to Charizard (stage 2) to simulate tail flame in wind
  const isCharizard = pokemon.stage === 2;

  return (
    <div className="flex flex-col items-center justify-center relative p-4 bg-gray-800/50 rounded-xl border border-gray-600">
      <div className="w-64 max-w-full">
         <HealthBar current={stats.hp} max={stats.maxHp} label={`${pokemon.isShiny ? '이로치 ' : ''}${config.name}`} />
      </div>
      
      <div className={`relative w-48 h-48 flex items-center justify-center transition-transform duration-100 
        ${isHit ? 'shake saturate-200 brightness-50' : 'animate-bob'} 
        ${attackAnimation ? 'translate-x-12' : ''}
      `}>
        <img 
          src={spriteUrl} 
          alt={config.name} 
          className={`w-full h-full object-contain drop-shadow-xl pixelated ${isCharizard ? 'animate-wind' : ''}`}
          style={{ imageRendering: 'pixelated' }}
        />
        {isHit && (
           <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse"></div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-400">
         보유 오랑열매: {stats.inventory.oranBerry}개
      </div>
    </div>
  );
};