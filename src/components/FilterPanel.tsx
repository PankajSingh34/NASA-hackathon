import React from 'react';

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
            selectedCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
          }`}
        >
          {category === 'all' ? 'All Categories' : category}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;