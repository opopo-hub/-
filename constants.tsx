import { NoteType } from './types';
import React from 'react';

// Symbols
export const NOTE_SYMBOLS: Record<NoteType, string> = {
  [NoteType.WHOLE]: '𝅝',
  [NoteType.DOTTED_HALF]: '𝅗𝅥.',
  [NoteType.HALF]: '𝅗𝅥',
  [NoteType.DOTTED_QUARTER]: '♩.',
  [NoteType.QUARTER]: '♩',
  [NoteType.EIGHTH]: '♪',
};

// Rhythm Patterns
export const RHYTHM_PATTERNS: Record<NoteType, string> = {
  [NoteType.WHOLE]: 'VVVV',
  [NoteType.DOTTED_HALF]: 'VVV',
  [NoteType.HALF]: 'VV',
  [NoteType.DOTTED_QUARTER]: 'V/',
  [NoteType.QUARTER]: 'V',
  [NoteType.EIGHTH]: '/',
};

// Pokemon Config
export const POKEMON_CONFIG = {
  0: { name: '파이리', maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png' },
  1: { name: '리자드', maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/5.png' },
  2: { name: '리자몽', maxHp: 200, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png' },
};

export const DIALGA_CONFIG = {
  name: '디아루가',
  maxHp: 610,
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/483.png',
  moves: [
    { name: '(드래곤)용의 숨결', damage: 10 },
    { name: '(강철)메탈크로우', damage: 20 },
    { name: '(드래곤)용성군', damage: 30 },
    { name: '(강철)아이언헤드', damage: 40 },
  ]
};

export const CHARIZARD_MOVES = [
  { id: 'fire_spin', name: '회오리불꽃', damage: 25, type: 'normal', maxUses: Infinity },
  { id: 'dragon_breath', name: '용의숨결', damage: 47, type: 'special', maxUses: Infinity }, // Marked with * in prompt for PVP, assuming special
  { id: 'blast_burn', name: '블러스트번', damage: 63, type: 'special', maxUses: 3 },
  { id: 'dragon_claw', name: '드래곤크루', damage: 82, type: 'normal', maxUses: 3 },
];

export const SHOP_CONFIG = {
  berryCost: 100,
  berryHealPercent: 0.5,
};

export const DAMAGE_VALUES = [35, 40, 45];
