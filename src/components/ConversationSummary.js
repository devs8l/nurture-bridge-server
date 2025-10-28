'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BoxLoader from './BoxLoader';
import { processText } from '../services/summary';

export default function ConversationSummary({ summaryData, loading }) {
    const router = useRouter();
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [editingAnswers, setEditingAnswers] = useState({});
    const [editedAnswers, setEditedAnswers] = useState({});
    const [savedAnswers, setSavedAnswers] = useState({}); // This will store the current saved state
    const [rephrasing, setRephrasing] = useState({}); // Track which answers are being rephrased

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

    const toggleEditAnswer = (index) => {
        setEditingAnswers(prev => {
            const newState = {
                ...prev,
                [index]: !prev[index]
            };
            
            // If switching to edit mode, initialize the edited answer with current saved text
            if (newState[index]) {
                const currentText = savedAnswers[index] || questionsMapping[index].userResponse;
                setEditedAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [index]: currentText
                }));
            }
            
            return newState;
        });
    };

    const handleAnswerChange = (index, value) => {
        setEditedAnswers(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const saveAnswer = (index) => {
        // Save the edited answer as the new "current" state
        setSavedAnswers(prev => ({
            ...prev,
            [index]: editedAnswers[index]
        }));
        
        // Exit edit mode
        setEditingAnswers(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const cancelEdit = (index) => {
        // Reset to the last saved answer (not the original question response)
        const currentSavedText = savedAnswers[index] || questionsMapping[index].userResponse;
        setEditedAnswers(prev => ({
            ...prev,
            [index]: currentSavedText
        }));
        setEditingAnswers(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const revertToOriginal = (index) => {
        // Reset to the original question mapping response
        const originalText = questionsMapping[index].userResponse;
        setEditedAnswers(prev => ({
            ...prev,
            [index]: originalText
        }));
        // Remove any saved changes for this question
        setSavedAnswers(prev => {
            const newSavedAnswers = { ...prev };
            delete newSavedAnswers[index];
            return newSavedAnswers;
        });
        setEditingAnswers(prev => ({
            ...prev,
            [index]: false
        }));
    };

    const rephraseAnswer = async (index) => {
        try {
            setRephrasing(prev => ({ ...prev, [index]: true }));
            
            // Get the current text (either edited or saved or original)
            const currentText = editedAnswers[index] || savedAnswers[index] || questionsMapping[index].userResponse;
            
            // Call the processText API
            const response = await processText(currentText);
            
            // Update the edited answer with the rephrased text
            setEditedAnswers(prev => ({
                ...prev,
                [index]: response.response || response.text || response.rephrased || response.result || currentText
            }));
            
        } catch (error) {
            console.error('Error rephrasing text:', error);
            // You could add a toast notification here
        } finally {
            setRephrasing(prev => ({ ...prev, [index]: false }));
        }
    };

    // Helper function to check if answer has been modified from original
    const hasChanges = (index) => {
        const currentDisplayText = savedAnswers[index] || questionsMapping[index].userResponse;
        return currentDisplayText !== questionsMapping[index].userResponse;
    };

    const handleCompleteAssessment = () => {
        // Save assessment completion status
        localStorage.setItem('lastAssessmentCompleted', Date.now().toString());
        
        // Navigate to dashboard
        router.push('/dashboard');
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
                <div className="p-6 space-y-6 ">
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
                                        <div className="relative">
                                            {editingAnswers[index] ? (
                                                <div className="space-y-3 w-full">
                                                    <textarea
                                                        value={editedAnswers[index] || ''}
                                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                        className="w-full text-[rgba(34,40,54,0.8)] text-[24px] not-italic font-normal leading-[32px] tracking-[-0.48px] rounded-lg border-2 border-[#5C756B] bg-white p-4 resize-none focus:outline-none focus:border-[#4a6459] transition-all duration-200 min-h-[120px] box-border"
                                                        style={{
                                                            fontFamily: 'inherit'
                                                        }}
                                                        autoFocus
                                                        placeholder="Enter your response here..."
                                                    />
                                                    <div className="flex gap-2 flex-wrap">
                                                        <button
                                                            onClick={() => saveAnswer(index)}
                                                            className="text-white bg-[#5C756B] hover:bg-[#4a6459] px-4 py-2 rounded-md hanken text-sm transition-colors duration-200"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => cancelEdit(index)}
                                                            className="text-[#5C756B] bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md hanken text-sm transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => rephraseAnswer(index)}
                                                            disabled={rephrasing[index]}
                                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-md hanken text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {rephrasing[index] ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                                    Rephrasing...
                                                                </>
                                                            ) : (
                                                                'Rephrase'
                                                            )}
                                                        </button>
                                                        {hasChanges(index) && (
                                                            <button
                                                                onClick={() => revertToOriginal(index)}
                                                                className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-md hanken text-sm transition-colors duration-200"
                                                            >
                                                                Revert to Original
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full">
                                                    <p className="text-[rgba(34,40,54,0.8)] [leading-trim:both] [text-edge:cap] text-[24px] not-italic font-normal leading-[32px] tracking-[-0.48px] rounded-lg transition-all duration-200 w-full">
                                                        {savedAnswers[index] || question.userResponse}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => toggleEditAnswer(index)}
                                            className="text-[#5C756B] cursor-pointer bg-[#E3EEEC] hover:bg-[#d7e6e1] p-2 rounded-md hanken gap-2 flex items-center transition-all duration-200"
                                        >
                                            <img
                                                src="/edit.svg"
                                                className=""
                                                alt=""
                                            />
                                            {editingAnswers[index] ? 'Cancel Edit' : 'Edit Answer'}
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
                
                {/* Complete Assessment Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleCompleteAssessment}
                        className="w-full bg-[#5C756B] hover:bg-[#4a6459] text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hanken text-lg"
                    >
                        Complete Assessment
                    </button>
                </div>
            </div>
        </div>
    );
}