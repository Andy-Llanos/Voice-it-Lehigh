
import React from 'react';
import { FeedbackItem, Sentiment, FeedbackCategory } from '../types';

interface FeedbackCardProps {
  item: FeedbackItem;
}

const sentimentConfig = {
  [Sentiment.POSITIVE]: {
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    ringColor: 'ring-emerald-600/20',
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  [Sentiment.NEGATIVE]: {
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    ringColor: 'ring-red-600/20',
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  },
  [Sentiment.NEUTRAL]: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    ringColor: 'ring-gray-500/20',
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    )
  },
};

const categoryConfig = {
  [FeedbackCategory.COURSE]: 'bg-blue-100 text-blue-800',
  [FeedbackCategory.CLUB]: 'bg-purple-100 text-purple-800',
  [FeedbackCategory.GREEK_LIFE]: 'bg-yellow-100 text-yellow-800',
  [FeedbackCategory.CAMPUS_SERVICES]: 'bg-indigo-100 text-indigo-800',
  [FeedbackCategory.OTHER]: 'bg-gray-200 text-gray-800'
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ item }) => {
  const { bgColor, textColor, ringColor, icon } = sentimentConfig[item.sentiment];
  const catColors = categoryConfig[item.category];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-lehigh-brown pr-4">{item.title}</h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catColors}`}>
            {item.category}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {item.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">{item.body}</p>
      </div>
      <div className={`px-5 py-3 ${bgColor} flex items-center space-x-3`}>
        <div className={textColor}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>{item.sentiment}</p>
          <p className={`text-xs ${textColor} opacity-80`}>{item.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
