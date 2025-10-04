'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCallSummary } from '@/services/summary';
import ConversationSummary from '@/components/ConversationSummary';

export default function SummaryPage() {
    const params = useParams();
    const router = useRouter();
    const chatId = params.chatId;
    
    const [showChatHistory, setShowChatHistory] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debug logging
    useEffect(() => {
        console.log('Summary page loaded');
        console.log('Params:', params);
        console.log('Chat ID:', chatId);
    }, [params, chatId]);

    const handleGoBack = () => {
        if (showChatHistory) {
            setShowChatHistory(false);
        } else {
            router.push('/chat');
        }
    };

    const handleStartNewAssessment = () => {
        router.push('/chat');
    };

    const handleViewChatHistory = async () => {
        if (!chatId) {
            setError('No chat ID provided');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await getCallSummary(chatId);
            
            if (result.success) {
                setSummaryData(result.summary);
                setShowChatHistory(true);
            } else {
                setError(result.error || 'Failed to fetch chat history');
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching chat history');
            console.error('Error fetching chat history:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            {!showChatHistory ? (
                // Original Summary View
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg 
                                    className="w-8 h-8 text-green-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Assessment Complete
                            </h1>
                            <p className="text-gray-600">
                                Thank you for completing the M-CHAT-R screening assessment
                            </p>
                        </div>

                        {/* Chat ID Display */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Session Details
                            </h2>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Chat ID:</span>
                                <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                                    {chatId || 'Loading...'}
                                </span>
                            </div>
                        </div>

                        {/* Summary Placeholder */}
                        <div className="bg-blue-50 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Assessment Summary
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="text-green-600 font-medium">Completed</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="text-gray-900">
                                        {new Date().toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-red-800 text-sm">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleViewChatHistory}
                                disabled={loading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 relative"
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600 absolute left-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span className={loading ? 'ml-6' : ''}>
                                    {loading ? 'Loading...' : 'View Chat History'}
                                </span>
                            </button>
                            <button
                                onClick={handleStartNewAssessment}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Start New Assessment
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                This assessment session has been saved with ID: 
                                <span className="font-mono ml-1">{chatId}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Chat History View
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Chat History
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Session ID: <span className="font-mono">{chatId}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleGoBack}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Summary
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Conversation Summary Component */}
                    <ConversationSummary summaryData={summaryData} />
                </div>
            )}
        </div>
    );
}