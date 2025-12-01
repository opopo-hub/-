import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  showText?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({ current, max, label, color = 'bg-green-500', showText = true }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Dynamic color based on low health if default green is used
  let barColor = color;
  if (color === 'bg-green-500') {
    if (percentage < 25) barColor = 'bg-red-500';
    else if (percentage < 50) barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full mb-2">
      {label && <div className="text-sm font-bold mb-1 flex justify-between">
        <span>{label}</span>
        {showText && <span>{Math.max(0, current)} / {max}</span>}
      </div>}
      <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-gray-600 overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};