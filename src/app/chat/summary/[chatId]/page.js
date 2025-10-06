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
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false); // Track if we've attempted to fetch

    // Debug logging
    useEffect(() => {
        console.log('Summary page loaded');
        console.log('Params:', params);
        console.log('Chat ID:', chatId);
    }, [params, chatId]);

    useEffect(() => {
        if (!chatId) {
            console.warn('No chatId provided in params');
            setLoading(false);
            setError('No chat ID provided');
            return;
        }

        // Prevent multiple fetches for the same chatId
        if (hasFetched) {
            return;
        }

        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
            setHasFetched(true);

            try {
                console.log('Fetching summary for chat ID:', chatId);
                const result = await getCallSummary(chatId);
                
                if (result.success) {
                    console.log('Summary fetched successfully:', result.summary);
                    setSummaryData(result.summary);
                } else {
                    console.error('Failed to fetch summary:', result.error);
                    setError(result.error || 'Failed to fetch summary');
                }
            } catch (err) {
                console.error('Error fetching summary:', err);
                setError('An unexpected error occurred while fetching the summary');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [chatId, hasFetched]);

    // Show error state
    if (error && !loading) {
        return (
            <div className="h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4 relative">
                <div className="bg-[#F5FAFC] rounded-2xl w-full shadow-2xl p-1 border h-full border-gray-100 overflow-hidden pb-24">
                    <div className="bg-gradient-to-r bg-[#E2EAE7] text-white px-8 py-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm text-[#222836] hanken">Conversation Summary</h2>
                            </div>
                        </div>
                    </div>
                    <div className="h-full flex items-center justify-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
                            <p className="text-red-800 alliance text-lg mb-2">Error Loading Summary</p>
                            <p className="text-red-600 alliance text-sm mb-4">{error}</p>
                            <button 
                                onClick={() => {
                                    setError(null);
                                    setHasFetched(false);
                                    setSummaryData(null);
                                    setLoading(true);
                                }} 
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <div className="h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4 relative">
            <ConversationSummary summaryData={summaryData} loading={loading} />
        </div>
    );
}