import React from 'react';
import { Question } from '../types';

interface QuizGameProps {
  question: Question;
  round: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (value: any) => void;
  streak: number;
}

export const QuizGame: React.FC<QuizGameProps> = ({ question, round, currentQuestionIndex, totalQuestions, onAnswer, streak }) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <div className="bg-blue-900/50 px-4 py-2 rounded-full border border-blue-500">
          <span className="font-bold text-blue-200">ROUND {round}</span>
        </div>
        <div className="text-xl font-bold">
          Q. {currentQuestionIndex + 1} <span className="text-gray-500 text-sm">/ {totalQuestions}</span>
        </div>
        <div className="bg-orange-900/50 px-4 py-2 rounded-full border border-orange-500">
           🔥 Streak: {streak}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md w-full p-12 rounded-2xl shadow-2xl border border-white/20 min-h-[300px] flex flex-col items-center justify-center mb-8">
        {question.display}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option.value)}
            className="group relative bg-indigo-900/80 hover:bg-indigo-600 border-2 border-indigo-400/50 hover:border-indigo-300 rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            <div className="text-3xl font-bold flex justify-center items-center h-12">
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};