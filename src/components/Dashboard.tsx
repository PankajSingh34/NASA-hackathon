import React, { useState } from 'react';
import PrimaryNav from './PrimaryNav';
import { ResearchArea } from '../types';
import ResearchCard from './ResearchCard';
import Modal from './Modal';
import SearchBox from './SearchBox';
import FilterPanel from './FilterPanel';

interface DashboardProps {
  researchAreas: ResearchArea[];
}

const Dashboard: React.FC<DashboardProps> = ({ researchAreas }) => {
  const [selectedArea, setSelectedArea] = useState<ResearchArea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const categories = ['all', ...Array.from(new Set(researchAreas.map(area => area.category)))];

  const filteredAreas = researchAreas.filter(area => {
    const matchesSearch = area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || area.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (area: ResearchArea) => {
    setSelectedArea(area);
  };

  const closeModal = () => {
    setSelectedArea(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white mb-4">
                NASA Space Biology Knowledge Engine
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Explore cutting-edge research in space biology, from plant growth in microgravity 
                to human physiological adaptations during spaceflight. Discover how life adapts 
                to the unique challenges of space environments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">{researchAreas.length}</h3>
                  <p className="text-gray-300">Research Areas</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    {researchAreas.reduce((sum, area) => sum + area.publications, 0)}
                  </h3>
                  <p className="text-gray-300">Publications</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">15+</h3>
                  <p className="text-gray-300">Active Missions</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'research':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBox 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search research areas..."
              />
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAreas.map((area) => (
                <ResearchCard
                  key={area.id}
                  researchArea={area}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        );
      case 'publications':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white mb-8">Publications Database</h2>
            <p className="text-gray-300 mb-8">
              Access to comprehensive space biology research publications
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <p className="text-lg text-gray-300">
                Publications database coming soon. Currently tracking {researchAreas.reduce((sum, area) => sum + area.publications, 0)} publications across all research areas.
              </p>
            </div>
          </div>
        );
      case 'missions':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white mb-8">Space Missions</h2>
            <p className="text-gray-300 mb-8">
              Explore space missions conducting biological research
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <p className="text-lg text-gray-300">
                Mission database coming soon. Tracking experiments across ISS, lunar, and Mars missions.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <PrimaryNav active={activeTab} onChange={setActiveTab} />
      <div className="h-14" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 pb-20 pt-4">
        {renderTabContent()}
      </div>

      {/* Modal */}
      {selectedArea && (
        <Modal
          isOpen={!!selectedArea}
          onClose={closeModal}
          researchArea={selectedArea}
        />
      )}
    </div>
  );
};

export default Dashboard;