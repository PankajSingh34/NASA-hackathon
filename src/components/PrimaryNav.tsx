import React, { useState, useEffect } from 'react';
import { Rocket, Menu, X, Microscope, BookOpen, Globe2, Activity } from 'lucide-react';

interface PrimaryNavProps {
  active: string;
  onChange: (tab: string) => void;
}

const tabs: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Globe2 className="w-4 h-4"/> },
  { id: 'research', label: 'Research', icon: <Microscope className="w-4 h-4"/> },
  { id: 'publications', label: 'Publications', icon: <BookOpen className="w-4 h-4"/> },
  { id: 'missions', label: 'Missions', icon: <Activity className="w-4 h-4"/> }
];

const PrimaryNav: React.FC<PrimaryNavProps> = ({ active, onChange }) => {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-shadow ${elevated ? 'shadow-lg shadow-black/40' : ''}`}>      
      <nav className="backdrop-blur-md bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm tracking-wide text-white">
            <Rocket className="w-5 h-5 text-nasa-red"/> <span className="hidden xs:inline">Space Biology Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`px-4 py-2 text-sm rounded-full flex items-center gap-2 transition-colors ${
                  active === t.id
                    ? 'bg-nasa-blue/70 text-white border border-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          <button
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
        {/* Mobile panel */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md px-4 pb-4 pt-2 flex flex-col gap-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                  active === t.id
                    ? 'bg-nasa-blue/60 text-white border border-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.icon}<span>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

export default PrimaryNav;
