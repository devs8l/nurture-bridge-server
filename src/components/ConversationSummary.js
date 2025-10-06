'use client';

import { useState, useEffect } from 'react';
import BoxLoader from './BoxLoader';

export default function ConversationSummary({ summaryData, loading }) {
    const [expandedQuestions, setExpandedQuestions] = useState({});

    // Always show loading state first if loading is true
    if (loading) {
        return (
            <div className="bg-[#F5FAFC] rounded-2xl hanken w-full shadow-2xl p-1 border h-full border-gray-100 overflow-hidden pb-24">
                {/* Assessment Header */}
                <div className="bg-gradient-to-r bg-[#E2EAE7] text-white px-8 py-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-[#222836] ">Conversation Summary</h2>
                        </div>
                    </div>
                </div>
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <BoxLoader />
                        <p className="text-gray-600  text-lg mt-6">Loading conversation summary...</p>
                        <p className="text-gray-500  text-sm mt-2">This may take a moment as we process the call data</p>
                    </div>
                </div>
            </div>
        );
    }

    // Only show no data message if we're not loading AND there's really no data
    if (!loading && (!summaryData || !summaryData.questionsMapping || summaryData.questionsMapping.length === 0)) {
        return (
            <div className="bg-[#F5FAFC] rounded-2xl w-full shadow-2xl p-1 border h-full border-gray-100 overflow-hidden pb-24">
                {/* Assessment Header */}
                <div className="bg-gradient-to-r bg-[#E2EAE7] text-white px-8 py-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-[#222836] hanken">Conversation Summary</h2>
                        </div>
                    </div>
                </div>
                <div className="h-full flex items-center justify-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-800 alliance text-lg">No conversation data available</p>
                        <p className="text-yellow-600 alliance text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
                    </div>
                </div>
            </div>
        );
    }

    const { questionsMapping } = summaryData;

    const toggleQuestion = (index) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="bg-[#F5FAFC] rounded-2xl w-full shadow-2xl p-1 border h-full border-gray-100 overflow-hidden pb-24">
            {/* Assessment Header */}
            <div className="bg-gradient-to-r bg-[#E2EAE7] text-white px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm text-[#222836] hanken">Assessment Summary</h2>
                    </div>
                </div>
            </div>

            {/* Questions Content */}
            <div className="h-full w-[95%] mx-auto alliance overflow-y-auto scroll-smooth">
                <div className="p-6 space-y-6 pb-52">
                    {questionsMapping.map((question, index) => (
                        <div key={index} className="">
                            <div className="flex items-start justify-between border-[0.5px] rounded-2xl border-[#2228361f] p-8 mb-2">
                                <div className="flex-1">
                                    <div className="space-y-4">
                                        {/* Actual Question */}
                                        <div>
                                            <p className="text-[#222836] [leading-trim:both] [text-edge:cap]  text-[28px] not-italic font-normal leading-[40px] tracking-[-0.56px]">
                                                {question.actualQuestionAsked}
                                            </p>
                                        </div>

                                        {/* User Response */}
                                        <div>
                                            <p className="text-[rgba(34,40,54,0.8)] [leading-trim:both] [text-edge:cap] text-[24px] not-italic font-normal leading-[32px] tracking-[-0.48px] rounded-lg ">
                                                {question.userResponse}
                                            </p>
                                        </div>

                                        <button className="text-[#5C756B] cursor-pointer bg-[#E3EEEC] p-2 rounded-md hanken gap-2 flex items-center ">
                                            <img
                                                src="/edit.svg"
                                                className=""
                                                alt=""
                                            />
                                            
                                            Edit Answer
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        className={`w-5 h-5 transform transition-transform ${expandedQuestions[index] ? 'rotate-180' : ''
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
        </div>
    );
}