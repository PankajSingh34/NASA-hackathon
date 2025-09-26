import React from 'react';
import { ResearchArea } from '../types';

interface ResearchCardProps {
  researchArea: ResearchArea;
  onClick: (area: ResearchArea) => void;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ researchArea, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(researchArea);
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 cursor-pointer 
                 hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-xl"
      onClick={handleClick}
    >
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">{researchArea.title}</h3>
        <span className="inline-block px-2.5 py-1 text-xs sm:text-sm bg-blue-500/30 text-blue-300 rounded-full">
          {researchArea.category}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
        {researchArea.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-sm text-gray-400">
          <span className="font-semibold">{researchArea.publications}</span> publications
        </div>
        <button 
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-xs sm:text-sm"
          onClick={handleClick}
        >
          Learn More →
        </button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {researchArea.keyResearchers.slice(0, 2).map((researcher, index) => (
          <span 
            key={index}
            className="text-[10px] sm:text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded"
          >
            {researcher}
          </span>
        ))}
        {researchArea.keyResearchers.length > 2 && (
          <span className="text-[10px] sm:text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded">
            +{researchArea.keyResearchers.length - 2} more
          </span>
        )}
      </div>
    </div>
  );
};

export default ResearchCard;