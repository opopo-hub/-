import React from 'react';
import { Pokemon, PlayerStats } from '../types';
import { SPECIES_CONFIG } from '../constants';
import { HealthBar } from './HealthBar';
import { Heart, CloudRain } from 'lucide-react';

interface PokemonDisplayProps {
  pokemon: Pokemon;
  stats: PlayerStats;
  isHit?: boolean;
  attackAnimation?: boolean;
  emotion: 'neutral' | 'happy' | 'sad';
}

export const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon, stats, isHit, attackAnimation, emotion }) => {
  const speciesData = SPECIES_CONFIG[pokemon.species];
  const config = speciesData.stages[pokemon.stage];
  const spriteUrl = pokemon.isShiny ? config.shinySprite : config.sprite;
  
  // Apply wind animation only to stage 2 (fully evolved) to simulate tail flame/cape in wind
  const isFinalStage = pokemon.stage === 2;

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
          className={`w-full h-full object-contain drop-shadow-xl pixelated ${isFinalStage ? 'animate-wind' : ''}`}
          style={{ imageRendering: 'pixelated' }}
        />
        {isHit && (
           <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse"></div>
        )}

        {/* Emotion Overlays */}
        {emotion === 'happy' && (
          <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
            <Heart className="text-red-500 fill-red-500 animate-heart-float absolute -top-4 left-1/2" size={24} />
            <Heart className="text-pink-400 fill-pink-400 animate-heart-float absolute -top-8 left-1/3 animation-delay-200" size={20} />
            <Heart className="text-red-400 fill-red-400 animate-heart-float absolute -top-2 left-2/3 animation-delay-500" size={16} />
          </div>
        )}
        
        {emotion === 'sad' && (
           <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
             <CloudRain className="text-blue-400 absolute -top-6" size={32} />
             <div className="absolute top-0 left-1/3 w-1 h-3 bg-blue-400 rounded-full animate-tear-drop"></div>
             <div className="absolute top-2 left-1/2 w-1 h-3 bg-blue-300 rounded-full animate-tear-drop animation-delay-300"></div>
             <div className="absolute top-0 left-2/3 w-1 h-3 bg-blue-500 rounded-full animate-tear-drop animation-delay-700"></div>
           </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-400">
         보유 오랑열매: {stats.inventory.oranBerry}개
      </div>
    </div>
  );
};