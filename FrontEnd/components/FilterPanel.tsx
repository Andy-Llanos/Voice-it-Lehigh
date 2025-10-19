
import React from 'react';
import { FeedbackCategory, Sentiment } from '../types';

interface FilterPanelProps {
  filters: {
    sentiment: Sentiment | 'all';
    category: FeedbackCategory | 'all';
  };
  onFilterChange: (newFilters: { sentiment: Sentiment | 'all'; category: FeedbackCategory | 'all' }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sentiment: e.target.value as Sentiment | 'all' });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value as FeedbackCategory | 'all' });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-lehigh-brown mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="sentiment-filter" className="block text-sm font-medium text-gray-700">
            Sentiment
          </label>
          <select
            id="sentiment-filter"
            value={filters.sentiment}
            onChange={handleSentimentChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm rounded-md"
          >
            <option value="all">All Sentiments</option>
            {Object.values(Sentiment).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={handleCategoryChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm rounded-md"
          >
            <option value="all">All Categories</option>
            {Object.values(FeedbackCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
