'use client';

import { useState, useEffect } from 'react';

export default function ConversationSummary({ summaryData }) {
    const [expandedQuestions, setExpandedQuestions] = useState({});

    if (!summaryData || !summaryData.chatSegregation) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">No conversation data available</p>
            </div>
        );
    }

    const { chatSegregation, questionsMapping } = summaryData;

    const toggleQuestion = (index) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Chat Segregation Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Conversation Summary
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Overview of the assessment conversation
                    </p>
                </div>
                
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Bot Messages */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <h4 className="font-medium text-gray-900">
                                    Doctor Messages ({chatSegregation.bot.length})
                                </h4>
                            </div>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {chatSegregation.bot.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-blue-50 border border-blue-100 rounded-lg p-3"
                                    >
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {message}
                                        </p>
                                        <span className="text-xs text-blue-600 mt-2 block">
                                            Message {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Messages */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <h4 className="font-medium text-gray-900">
                                    User Responses ({chatSegregation.user.length})
                                </h4>
                            </div>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {chatSegregation.user.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-green-50 border border-green-100 rounded-lg p-3"
                                    >
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {message}
                                        </p>
                                        <span className="text-xs text-green-600 mt-2 block">
                                            Response {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Mapping Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Question Analysis
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Detailed mapping of assessment questions and responses
                    </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                    {questionsMapping.map((question, index) => (
                        <div key={index} className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full">
                                            {index + 1}
                                        </span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {question.language.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Script Question */}
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                                                Original Question from Script:
                                            </h5>
                                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                                {question.questionFromScript}
                                            </p>
                                        </div>

                                        {/* Actual Question */}
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                                                Question as Asked:
                                            </h5>
                                            <p className="text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
                                                {question.actualQuestionAsked}
                                            </p>
                                        </div>

                                        {/* User Response */}
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                                                User Response:
                                            </h5>
                                            <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
                                                {question.userResponse}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg 
                                        className={`w-5 h-5 transform transition-transform ${
                                            expandedQuestions[index] ? 'rotate-180' : ''
                                        }`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Assessment Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                            {questionsMapping.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            Questions Asked
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {chatSegregation.bot.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            Doctor Messages
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {chatSegregation.user.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            User Responses
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {new Set(questionsMapping.map(q => q.language)).size}
                        </div>
                        <div className="text-sm text-gray-600">
                            Languages
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}