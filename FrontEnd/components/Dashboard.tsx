
import React, { useState, useMemo, useCallback } from 'react';
import { FeedbackItem, FeedbackCategory, Sentiment } from '../types';
import Header from './Header';
import FeedbackCard from './FeedbackCard';
import FeedbackForm from './FeedbackForm';
import FilterPanel from './FilterPanel';
import SentimentChart from './SentimentChart';

// MOCK DATA
const initialFeedback: FeedbackItem[] = [
    { id: '1', title: 'CSE 109 is too difficult', body: 'The professor assigns too much homework and the projects are impossible to finish on time. The TAs are not very helpful during office hours.', category: FeedbackCategory.COURSE, sentiment: Sentiment.NEGATIVE, summary: 'Feedback expresses difficulty with course workload and lack of TA support.', timestamp: new Date('2023-10-28T10:00:00Z'), organizationId: 'CSE109' },
    { id: '2', title: 'Great Ski Club Trip!', body: 'The trip to Vermont was incredibly well-organized and a lot of fun. Kudos to the E-board for their hard work. Maybe we can get better snacks next time.', category: FeedbackCategory.CLUB, sentiment: Sentiment.POSITIVE, summary: 'Positive feedback on a well-organized and enjoyable club trip.', timestamp: new Date('2023-10-27T14:30:00Z'), organizationId: 'Ski Club' },
    { id: '3', title: 'Campus dining quality', body: 'The quality of food at Rathbone has noticeably declined this semester. There are fewer options, and the hot food is often lukewarm.', category: FeedbackCategory.CAMPUS_SERVICES, sentiment: Sentiment.NEGATIVE, summary: 'Negative sentiment regarding the decline in campus dining quality and options.', timestamp: new Date('2023-10-26T12:00:00Z'), organizationId: 'Campus Dining' },
    { id: '4', title: 'Interfraternity Council Communication', body: 'Communication from the IFC about new policies has been clear and timely. It would be helpful to have a centralized calendar for all Greek events.', category: FeedbackCategory.GREEK_LIFE, sentiment: Sentiment.NEUTRAL, summary: 'Neutral feedback appreciating clear communication while suggesting a new feature.', timestamp: new Date('2023-10-25T09:00:00Z'), organizationId: 'IFC' },
    { id: '5', title: 'Career Services Resume Review', body: 'The resume review session was extremely helpful. The advisor gave me concrete feedback that I could immediately apply. Highly recommend!', category: FeedbackCategory.CAMPUS_SERVICES, sentiment: Sentiment.POSITIVE, summary: 'Very positive feedback about a helpful resume review session at career services.', timestamp: new Date('2023-10-29T11:00:00Z'), organizationId: 'Career Services' },
];

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, onLogout }) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(initialFeedback);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // For now, we assume user is a member of all orgs. In a real app, this would be based on user data.
  const userOrganizations = useMemo(() => [...new Set(initialFeedback.map(f => f.organizationId))], []);
  
  const [selectedOrg, setSelectedOrg] = useState<string>(userOrganizations[0] || '');
  const [filters, setFilters] = useState<{ sentiment: Sentiment | 'all'; category: FeedbackCategory | 'all' }>({
    sentiment: 'all',
    category: 'all',
  });

  const handleAddFeedback = (item: FeedbackItem) => {
    setFeedbackList(prev => [item, ...prev]);
  };

  const filteredFeedback = useMemo(() => {
    return feedbackList
      .filter(item => item.organizationId === selectedOrg)
      .filter(item => filters.sentiment === 'all' || item.sentiment === filters.sentiment)
      .filter(item => filters.category === 'all' || item.category === filters.category)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [feedbackList, filters, selectedOrg]);
  
  const handleFilterChange = useCallback((newFilters: { sentiment: Sentiment | 'all'; category: FeedbackCategory | 'all' }) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userEmail={userEmail} onLogout={onLogout} onAddFeedback={() => setIsModalOpen(true)} />
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <label htmlFor="organization-select" className="block text-sm font-medium text-gray-700 mb-1">Select Organization</label>
          <select
            id="organization-select"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm rounded-md shadow-sm"
          >
            {userOrganizations.map(org => <option key={org} value={org}>{org}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              <SentimentChart data={filteredFeedback} />
            </div>
          </div>

          <div className="lg:col-span-9">
            {filteredFeedback.length > 0 ? (
              <div className="space-y-6">
                {filteredFeedback.map(item => <FeedbackCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No Feedback Yet</h3>
                <p className="mt-1 text-sm text-gray-500">There's no feedback matching your current filters for {selectedOrg}.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <FeedbackForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddFeedback} 
          organizationId={selectedOrg}
        />
      )}
    </div>
  );
};

export default Dashboard;
