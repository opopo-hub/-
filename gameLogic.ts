import { NoteType, Question, LeaderboardEntry } from '../types';
import { NOTE_SYMBOLS, RHYTHM_PATTERNS } from '../constants';
import React from 'react';

// Helpers to create React elements for the display
const createNoteDisplay = (symbol: string) => React.createElement('span', { className: 'music-font mx-2' }, symbol);

export const generateRound1Questions = (): Question[] => {
  // Logic: 4분음표(Quarter) = 8분음표(Eighth) + 8분음표(Eighth)
  // Equation format: A = B + C or A + B = C
  
  const questions: Question[] = [];
  
  // Q1: Quarter = Eighth + ?
  questions.push({
    id: 'r1_q1',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' = ', createNoteDisplay(NOTE_SYMBOLS.EIGHTH), ' + ?'
    ),
    options: [
      { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
      { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH },
      { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF }
    ],
    correctValue: NoteType.EIGHTH
  });

  // Q2: Half = Quarter + ?
  questions.push({
    id: 'r1_q2',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.HALF), ' = ', createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' + ?'
    ),
    options: [
      { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH },
      { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
      { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE }
    ],
    correctValue: NoteType.QUARTER
  });

   // Q3: Dotted Half = Half + ?
   questions.push({
    id: 'r1_q3',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.DOTTED_HALF), ' = ', createNoteDisplay(NOTE_SYMBOLS.HALF), ' + ?'
    ),
    options: [
      { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
      { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH },
      { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF }
    ],
    correctValue: NoteType.QUARTER
  });

  // Q4: Whole = Half + ?
  questions.push({
    id: 'r1_q4',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.WHOLE), ' = ', createNoteDisplay(NOTE_SYMBOLS.HALF), ' + ?'
    ),
    options: [
        { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF },
        { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
        { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE }
    ],
    correctValue: NoteType.HALF
  });

  // Q5: Quarter + Quarter = ?
  questions.push({
    id: 'r1_q5',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' + ', createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' = ?'
    ),
    options: [
        { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE },
        { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF },
        { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH }
    ],
    correctValue: NoteType.HALF
  });

  // Q6: Eighth + Eighth = ?
  questions.push({
    id: 'r1_q6',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.EIGHTH), ' + ', createNoteDisplay(NOTE_SYMBOLS.EIGHTH), ' = ?'
    ),
    options: [
        { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
        { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF },
        { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH }
    ],
    correctValue: NoteType.QUARTER
  });

  // Q7: Dotted Quarter = Quarter + ?
  questions.push({
    id: 'r1_q7',
    display: React.createElement('div', { className: 'flex items-center text-4xl' },
      createNoteDisplay(NOTE_SYMBOLS.DOTTED_QUARTER), ' = ', createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' + ?'
    ),
    options: [
        { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
        { label: createNoteDisplay(NOTE_SYMBOLS.EIGHTH), value: NoteType.EIGHTH },
        { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF }
    ],
    correctValue: NoteType.EIGHTH
  });

  // Q8: Whole = ? + Half
  questions.push({
      id: 'r1_q8',
      display: React.createElement('div', { className: 'flex items-center text-4xl' },
        createNoteDisplay(NOTE_SYMBOLS.WHOLE), ' = ? + ', createNoteDisplay(NOTE_SYMBOLS.HALF)
      ),
      options: [
          { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF },
          { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER },
          { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE }
      ],
      correctValue: NoteType.HALF
  });

  // Q9: Half + Half = ?
  questions.push({
      id: 'r1_q9',
      display: React.createElement('div', { className: 'flex items-center text-4xl' },
        createNoteDisplay(NOTE_SYMBOLS.HALF), ' + ', createNoteDisplay(NOTE_SYMBOLS.HALF), ' = ?'
      ),
      options: [
          { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE },
          { label: createNoteDisplay(NOTE_SYMBOLS.DOTTED_HALF), value: NoteType.DOTTED_HALF },
          { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER }
      ],
      correctValue: NoteType.WHOLE
  });

  // Q10: Quarter + Eighth + Eighth = ?
  questions.push({
      id: 'r1_q10',
      display: React.createElement('div', { className: 'flex items-center text-4xl' },
        createNoteDisplay(NOTE_SYMBOLS.QUARTER), ' + ', createNoteDisplay(NOTE_SYMBOLS.EIGHTH), ' + ', createNoteDisplay(NOTE_SYMBOLS.EIGHTH), ' = ?'
      ),
      options: [
          { label: createNoteDisplay(NOTE_SYMBOLS.WHOLE), value: NoteType.WHOLE },
          { label: createNoteDisplay(NOTE_SYMBOLS.HALF), value: NoteType.HALF },
          { label: createNoteDisplay(NOTE_SYMBOLS.QUARTER), value: NoteType.QUARTER }
      ],
      correctValue: NoteType.HALF
  });

  return questions;
};

export const generateRound2Questions = (): Question[] => {
  const noteTypes = Object.values(NoteType);
  const questions: Question[] = [];

  // Generate 10 questions mixing different note types to rhythm patterns
  const sequence = [
      NoteType.WHOLE, NoteType.HALF, NoteType.QUARTER, NoteType.EIGHTH, 
      NoteType.DOTTED_HALF, NoteType.DOTTED_QUARTER, 
      NoteType.WHOLE, NoteType.QUARTER, NoteType.EIGHTH, NoteType.HALF
  ];

  sequence.forEach((noteType, index) => {
    // Pick 3 random distractors
    const correctPattern = RHYTHM_PATTERNS[noteType];
    const otherPatterns = Object.values(RHYTHM_PATTERNS).filter(p => p !== correctPattern);
    const shuffledDistractors = otherPatterns.sort(() => 0.5 - Math.random()).slice(0, 3); // take 2-3 distractors
    const optionsRaw = [correctPattern, ...shuffledDistractors.slice(0, 2)];
    
    const options = optionsRaw
      .sort(() => 0.5 - Math.random())
      .map(pattern => ({
        label: pattern,
        value: pattern
      }));

    questions.push({
      id: `r2_q${index}`,
      display: React.createElement('div', { className: 'flex flex-col items-center' },
          React.createElement('span', { className: 'text-xl mb-4' }, '다음 음표에 맞는 리듬꼴을 고르세요'),
          React.createElement('span', { className: 'music-font text-6xl' }, NOTE_SYMBOLS[noteType])
      ),
      options: options,
      correctValue: correctPattern
    });
  });

  return questions;
};

export const calculateDamage = () => {
    const rand = Math.random();
    if (rand < 0.333) return { dmg: 35, msg: "별 효과가 없었다..." };
    if (rand < 0.666) return { dmg: 40, msg: "" };
    return { dmg: 45, msg: "급소에 맞았다! (Critical)" };
};

const LEADERBOARD_KEY = 'dragon_music_math_leaderboard_v1';

export const getLeaderboardData = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    // Validation check: ensure it's an array and has correct properties
    if (!Array.isArray(parsed)) return [];
    
    return parsed.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch (e) {
    console.error("Failed to load leaderboard", e);
    return [];
  }
};

export const saveLeaderboardData = (name: string, score: number, isShiny: boolean): LeaderboardEntry[] => {
  try {
    const currentData = getLeaderboardData();
    
    const newEntry: LeaderboardEntry = {
      name: name.trim() || "Unknown",
      score: score,
      isShiny: isShiny,
      date: new Date().toISOString()
    };
    
    // Add new entry, Sort descending by score, Keep top 10
    const newData = [...currentData, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
      
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(newData));
    return newData;
  } catch (e) {
    console.error("Failed to save leaderboard", e);
    return [];
  }
};