
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

// Species Configuration
export const SPECIES_CONFIG = {
  charmander: {
    name: '파이리',
    type: '불꽃',
    description: '공격력 12% 증가, 방어력 6% 감소',
    modifiers: { atk: 1.12, dmgTaken: 1.06 },
    stages: {
      0: { name: '파이리', maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png' },
      1: { name: '리자드', maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/5.png' },
      2: { name: '리자몽', maxHp: 200, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png' },
    }
  },
  chimchar: {
    name: '불꽃숭이',
    type: '불꽃/격투',
    description: '공격력 18% 증가, 방어력 10% 감소',
    modifiers: { atk: 1.18, dmgTaken: 1.10 },
    stages: {
      0: { name: '불꽃숭이', maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/390.png' },
      1: { name: '파이숭이', maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/391.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/391.png' },
      2: { name: '초염몽', maxHp: 200, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/392.png' },
    }
  },
  piplup: {
    name: '펭도리',
    type: '물',
    description: '공격력 10% 증가, 방어력 7% 감소',
    modifiers: { atk: 1.10, dmgTaken: 1.07 },
    stages: {
      0: { name: '펭도리', maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/393.png' },
      1: { name: '팽태자', maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/394.png' },
      2: { name: '엠페르트', maxHp: 200, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png', shinySprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/395.png' },
    }
  }
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
  { id: 'dragon_breath', name: '용의숨결', damage: 47, type: 'special', maxUses: Infinity },
  { id: 'blast_burn', name: '블러스트번', damage: 63, type: 'special', maxUses: 3 },
  { id: 'dragon_claw', name: '드래곤크루', damage: 82, type: 'normal', maxUses: 3 },
];

export const SHOP_CONFIG = {
  berryCost: 100,
  berryHealPercent: 0.5,
};

export const DAMAGE_VALUES = [35, 40, 45];

export const MUSIC_URLS = {
  EVOLUTION: 'https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Evolution.mp3',
  BOSS: 'https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Battle%21%20Dialga_Palkia.mp3',
  ROUND_1: 'https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Route%20201%20%28Day%29.mp3',
  ROUND_2: 'https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Route%20209%20%28Day%29.mp3',
  VICTORY: 'https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Victory%21%20%28Trainer%20Battle%29.mp3'
};
