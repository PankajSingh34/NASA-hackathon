import React, { useEffect } from 'react';
import { ResearchArea } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchArea: ResearchArea;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, researchArea }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/20 
                      max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{researchArea.title}</h2>
              <span className="inline-block px-3 py-1 text-sm bg-blue-500/30 text-blue-300 rounded-full">
                {researchArea.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
            <p className="text-gray-300 leading-relaxed">
              {researchArea.detailedDescription}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Key Findings</h3>
            <ul className="space-y-3">
              {researchArea.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                  <span className="text-gray-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Future Directions</h3>
            <ul className="space-y-3">
              {researchArea.futureDirections.map((direction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                  <span className="text-gray-300">{direction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Key Researchers</h3>
            <div className="flex flex-wrap gap-3">
              {researchArea.keyResearchers.map((researcher, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg border border-white/20"
                >
                  {researcher}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Relevant Missions</h3>
            <div className="flex flex-wrap gap-3">
              {researchArea.relevantMissions.map((mission, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30"
                >
                  {mission}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/20">
            <div className="text-sm text-gray-400">
              <span className="font-semibold">{researchArea.publications}</span> publications in this area
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;