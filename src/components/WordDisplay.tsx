import React from 'react';
import { Star } from 'lucide-react';

interface WordDisplayProps {
  word: string;
  isBonus?: boolean;
  points: number;
}

export function WordDisplay({ word, isBonus = false, points }: WordDisplayProps) {
  return (
    <div className="bg-blue-50/80 backdrop-blur rounded-lg p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-3 sm:space-y-4">
        {isBonus && (
          <div className="flex items-center justify-center gap-2 text-yellow-500 animate-bounce">
            <Star className="w-6 h-6 fill-current" />
            <span className="font-bold">Bonus Kelime! (+{points} Puan)</span>
            <Star className="w-6 h-6 fill-current" />
          </div>
        )}
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 transition-all duration-300 hover:scale-105">
          {word}
        </p>
        <p className="text-base sm:text-lg text-gray-600">
          Bu kelimeyi doğru okuyabilir misin?
        </p>
        {!isBonus && (
          <p className="text-sm text-gray-500">
            Doğru cevap: +{points} puan
          </p>
        )}
      </div>
    </div>
  );
}