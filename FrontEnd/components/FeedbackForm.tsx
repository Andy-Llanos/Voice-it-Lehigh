
import React, { useState } from 'react';
import { FeedbackItem, FeedbackCategory, Sentiment } from '../types';
import { checkProfanity, analyzeSentiment } from '../services/geminiService';

interface FeedbackFormProps {
  onClose: () => void;
  onSubmit: (item: FeedbackItem) => void;
  organizationId: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, onSubmit, organizationId }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>(FeedbackCategory.COURSE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      setError('Please fill out all fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    // 1. Check for profanity
    const isSafe = await checkProfanity(`${title} ${body}`);
    if (!isSafe) {
      setError("Your feedback contains inappropriate language. Please revise and resubmit.");
      setIsLoading(false);
      return;
    }

    // 2. Analyze sentiment
    const sentimentResult = await analyzeSentiment(body);

    // 3. Create feedback item
    const newFeedback: FeedbackItem = {
      id: new Date().toISOString(),
      title,
      body,
      category,
      sentiment: sentimentResult.sentiment,
      summary: sentimentResult.summary,
      timestamp: new Date(),
      organizationId,
    };

    onSubmit(newFeedback);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Submit Anonymous Feedback</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              You are submitting feedback for: <span className="font-bold text-lehigh-brown">{organizationId}</span>. This feedback is anonymous.
            </p>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm rounded-md"
              >
                {Object.values(FeedbackCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700">Feedback</label>
              <textarea
                id="body"
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-lehigh-brown focus:border-lehigh-brown sm:text-sm"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
          </div>
          <div className="px-6 py-3 bg-gray-50 flex justify-end items-center space-x-3">
             {isLoading && <span className="text-sm text-gray-500">Analyzing...</span>}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lehigh-brown disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lehigh-brown hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lehigh-brown disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
