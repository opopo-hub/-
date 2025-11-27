import React from 'react';

export enum GamePhase {
  INTRO = 'INTRO',
  ROUND_1 = 'ROUND_1',
  ROUND_2 = 'ROUND_2',
  EVOLUTION = 'EVOLUTION',
  PRE_BOSS = 'PRE_BOSS',
  BOSS_BATTLE = 'BOSS_BATTLE',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum NoteType {
  WHOLE = 'WHOLE',
  HALF = 'HALF',
  QUARTER = 'QUARTER',
  EIGHTH = 'EIGHTH',
  DOTTED_HALF = 'DOTTED_HALF',
  DOTTED_QUARTER = 'DOTTED_QUARTER'
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  score: number;
  streak: number;
  inventory: {
    oranBerry: number;
  };
  name: string;
}

export interface Pokemon {
  stage: 0 | 1 | 2; // 0: Charmander, 1: Charmeleon, 2: Charizard
  isShiny: boolean;
}

export interface Question {
  id: string;
  display: React.ReactNode;
  options: { label: string | React.ReactNode; value: any }[];
  correctValue: any;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface Boss {
  hp: number;
  maxHp: number;
}