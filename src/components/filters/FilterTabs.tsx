import React from 'react';
import { cn } from '@/lib/utils';

interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
