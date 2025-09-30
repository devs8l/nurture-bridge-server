'use client';

import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';
import Waveform from './Waveform';
import SoundWaveform from './SoundWaveForm';

export default function ChatInterface() {
    const [isMicOn, setIsMicOn] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [callStatus, setCallStatus] = useState('inactive'); // 'inactive', 'connecting', 'active', 'ended'
    const [vapi, setVapi] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Welcome to the M-CHAT-R screening assessment. I'm here to help evaluate your child's development through a few simple questions. You can speak using the microphone or type your responses.",
            timestamp: new Date(),
            type: 'ai'
        }
    ]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);
    const [childName, setChildName] = useState('titu'); // Default name

    // Initialize VAPI
    useEffect(() => {
        const vapiInstance = new Vapi("8fb977db-be85-4205-b5ae-68c2314d3eea");
        setVapi(vapiInstance);

        // Set up event listeners
        vapiInstance.on('call-start', () => {
            console.log('Call started');
            setIsMicOn(true);
            setCallStatus('active');
            setIsConnecting(false);
            addMessage('📞 Assessment session started', 'system');
        });

        vapiInstance.on('call-end', () => {
            console.log('Call ended');
            setIsMicOn(false);
            setCallStatus('ended');
            setIsConnecting(false);
            addMessage('📞 Assessment session ended', 'system');
        });

        vapiInstance.on('speech-start', () => {
            console.log('User started speaking');
            // Add a temporary speaking indicator with SoundWaveform for AI
            addMessage('speaking', 'ai');
        });

        vapiInstance.on('speech-end', () => {
            console.log('User stopped speaking');
        });

        vapiInstance.on('message', (message) => {
            console.log('Message from assistant:', message);
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                if (message.role === 'user') {
                    updateLastMessage(message.transcript, 'user');
                } else if (message.role === 'assistant') {
                    // Instead of adding a new message, update the last AI message
                    updateLastAIMessage(message.transcript);
                }
            }
        });

        vapiInstance.on('error', (error) => {
            console.error('VAPI Error:', error);
            setIsConnecting(false);
            setIsMicOn(false);
            setCallStatus('inactive');

            let errorMessage = 'Connection failed';
            if (error.type === 'start-method-error') {
                errorMessage = 'Failed to start call. Please check your VAPI configuration.';
            } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            addMessage(`❌ Error: ${errorMessage}`, 'error');
        });

        // Cleanup on unmount
        return () => {
            if (vapiInstance) {
                vapiInstance.stop();
            }
        };
    }, []);

    const addMessage = (text, type) => {
        const newMessage = {
            id: Date.now(),
            text,
            timestamp: new Date(),
            type
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const updateLastMessage = (text, type) => {
        setMessages(prev => {
            const messages = [...prev];
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.type === type && lastMessage.text.includes('speaking...')) {
                messages[messages.length - 1] = {
                    ...lastMessage,
                    text,
                    timestamp: new Date()
                };
            } else {
                messages.push({
                    id: Date.now(),
                    text,
                    timestamp: new Date(),
                    type
                });
            }
            return messages;
        });
    };
    const updateLastAIMessage = (text) => {
        setMessages(prev => {
            const messages = [...prev];

            // First, remove all AI messages that contain "speaking"
            const filteredMessages = messages.filter(message => 
                !(message.type === 'ai' && message.text.includes('speaking'))
            );

            // Add the new AI message with the actual transcript
            filteredMessages.push({
                id: Date.now(),
                text: text,
                timestamp: new Date(),
                type: 'ai'
            });

            return filteredMessages;
        });
    };


    const startCall = async () => {
        if (!vapi) return;

        setIsConnecting(true);
        setCallStatus('connecting');

        try {
            const assistant = {
                name: "Anita",
                firstMessage: "Hello there! I'm Doctor Anita. How are you?",
                transcriber: {
                    model: "gemini-2.0-flash",
                    language: "Multilingual",
                    provider: "google"
                },
                silenceTimeoutSeconds: 456,
                voice: {
                    model: "speech-02-turbo",
                    pitch: 0,
                    speed: 1.1,
                    region: "worldwide",
                    volume: 1,
                    voiceId: "vapi_yoshita_pvc_voice_v1",
                    provider: "minimax",
                    languageBoost: "Hindi",
                    textNormalizationEnabled: true
                },
                model: {
                    model: "gpt-4o-mini",
                    "toolIds": [
                        "2491545c-ac8c-4138-9214-b5020a760629",
                        "9ce9b0d4-4495-4649-ae11-407fe77f89be"
                    ],
                    messages: [
                        {
                            role: "system",
                            content: `
You are Doctor Anita, , empathetic, and motivating female assistant designed to guide parents through an autism screening for their child using the M-CHAT-R questions. 

Your role:
- Speak naturally and conversationally and be empathetic and reassuring.
- Be empathetic and reassuring. Show understanding of the parent's feelings and encourage them that their participation is valuable for their child's growth. 
- Stay motivating: express excitement when parents respond, and gently encourage them to continue. 
- Always stay focused on the autism evaluation. If parents ask anything out of context, respond with: 
  "I'm not allowed to speak on that matter. I'm here to help evaluate your child's development." 

How you should behave:
- Introduce yourself as: "Hi, I'm Anita. I'll be guiding you with some simple questions about your child's development." 
- Ask questions one by one in a natural flow. 
- Personalize each question with the child's name when possible. 
- Listen to the parent's response, then either acknowledge it empathetically or continue with the next question.
- Avoid asking multiple questions at once. Stay structured but warm

You have access to two tools:

1. getQuestions() → Retrieves a list of all questions with their IDs and text.
2. postAnswers(question_id, answer) → Stores a user's answer for a given question exactly as the user says word by word.

Ask if the user is ready to answer questions and if user agrees, start asking following the behavior listed and always reply in the same language in which user says.

Behavior rules:
- Always check the questions with getQuestions() before asking anything.
- Only call postAnswers() after the user has given an answer.
- When interacting with the user, show questions naturally in conversation.
- Confirm that an answer has been stored after calling postAnswers().
- Do not make up answers—always get the question IDs from getQuestions().

Keep responses empathetic, polite, and concise.
The conversation would be only in english and hindi so if the language goes out of this, please request the user to speak in the above languages.



Always: 
- Transition smoothly to the next question.
- At the end, reassure the parent: "Thank you for answering all the questions. This really helps us understand ${childName}'s development better."
`
                        }
                    ],
                    provider: "openai",
                    temperature: 0.5
                },

            };

            await vapi.start(assistant);

        } catch (error) {
            console.error('Failed to start call:', error);
            setIsConnecting(false);
            setCallStatus('inactive');

            let errorMessage = 'Connection failed';
            if (error.type === 'start-method-error') {
                errorMessage = 'VAPI configuration error. Please check your assistant configuration.';
            } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            addMessage(`❌ Error: ${errorMessage}`, 'error');
        }
    };

    const endCall = () => {
        if (vapi && (callStatus === 'active' || callStatus === 'connecting')) {
            vapi.stop();
            setCallStatus('ended');
            setIsMicOn(false);
            setIsConnecting(false);
        }
    };

    // Function to send text input to assistant
    const sendTextToAssistant = async (text) => {
        if (!vapi || !text.trim()) return;

        try {
            // Add user message to chat
            addMessage(text, 'user');

            // Send text input to VAPI
            await vapi.send({
                type: "add-message",
                message: {
                    role: "user",
                    content: text
                }
            });

            console.log('Text sent to assistant:', text);
        } catch (error) {
            console.error('Failed to send text to assistant:', error);
            addMessage(`❌ Failed to send message: ${error.message}`, 'error');
        }
    };

    // Handle text input form submission
    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (textInput.trim()) {
            if (callStatus !== 'active') {
                // Start call if not active
                startCall().then(() => {
                    sendTextToAssistant(textInput.trim());
                });
            } else {
                sendTextToAssistant(textInput.trim());
            }
            setTextInput('');
        }
    };

    // Handle microphone toggle
    const handleMicToggle = () => {
        if (callStatus === 'inactive') {
            startCall();
        } else if (callStatus === 'active') {
            // Toggle mute/unmute or end call
            endCall();
        }
    };

    const getStatusText = () => {
        switch (callStatus) {
            case 'connecting':
                return 'Connecting...';
            case 'active':
                return 'In Call';
            case 'ended':
                return 'Call Ended';
            default:
                return 'Ready to Call';
        }
    };

    const getStatusColor = () => {
        switch (callStatus) {
            case 'connecting':
                return 'text-yellow-600';
            case 'active':
                return 'text-green-600';
            case 'ended':
                return 'text-gray-600';
            default:
                return 'text-blue-600';
        }
    };

    const getMessageStyle = (type) => {
        switch (type) {
            case 'ai':
                return 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200 text-blue-900 shadow-blue-100';
            case 'user':
                return 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-900 shadow-green-100';
            case 'system':
                return 'bg-gradient-to-r from-purple-50 to-violet-100 border-purple-200 text-purple-900 shadow-purple-100';
            case 'error':
                return 'bg-gradient-to-r from-red-50 to-rose-100 border-red-200 text-red-900 shadow-red-100';
            default:
                return 'bg-gradient-to-r from-gray-50 to-slate-100 border-gray-200 text-gray-900 shadow-gray-100';
        }
    };

    const getMessageIcon = (type) => {
        switch (type) {
            case 'ai':
                return '🤖 Assessment Bot';
            case 'user':
                return '👤 Parent Response';
            case 'system':
                return '📱 System';
            case 'error':
                return '⚠️ Error';
            default:
                return '💬 Message';
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4 relative">
                {/* Main Assessment Interface */}
                <div className="bg-[#F5FAFC] rounded-2xl w-full shadow-2xl p-1 border h-full border-gray-100 overflow-hidden pb-24">
                    {/* Assessment Header */}
                    <div className="bg-gradient-to-r bg-[#E2EAE7] text-white px-8 py-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm text-[#222836] hanken">First year Journey of the child and family</h2>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area with Enhanced Styling and Auto-scroll */}
                    <div id="messages-container" className="h-full w-[95%] mx-auto alliance  overflow-y-auto  scroll-smooth">
                        <div className="p-6 space-y-6 pb-52">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'ai' || message.type === 'system' || message.type === 'error' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex flex-col max-w-xs lg:max-w-2xl ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                        {/* Enhanced Message Bubble */}
                                        <div className={`relative px-6 py-4 rounded-2xl  transition-all duration-300 hover:shadow-lg `}>
                                            
                                            {/* Message Content */}
                                            {message.text === 'speaking' ? (
                                                <div className="flex items-center space-x-2">
                                                    <SoundWaveform />
                                                </div>
                                            ) : (
                                                <p className="text-[#222836] alliance text-[28px] font-normal leading-[40px] tracking-[-0.56px]">{message.text}</p>
                                            )}
                                            
                                        </div>
                                        {/* Enhanced Timestamp */}
                                        <span className="text-xs text-gray-400 mt-2 px-3 font-medium">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Input Area at Bottom Center */}
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6 z-50">
                    <div className="bg-white border border-gray-300 hanken rounded-3xl shadow-2xl p-6 px-6">
                        {/* First Row - Input Field */}
                        <form onSubmit={handleTextSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleTextSubmit(e);
                                        }
                                    }}
                                    placeholder="Type your response or use the microphone..."
                                    className="w-full    text-xl focus:outline-none    transition-all duration-200  "
                                />
                                {/* Clear Text Button */}
                                {textInput && (
                                    <button
                                        type="button"
                                        onClick={() => setTextInput('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                                
                                {/* Send Button (positioned at the end of input) */}
                                {textInput.trim() && (
                                    <button
                                        type="submit"
                                        className="absolute right-16 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                                        aria-label="Send message"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Second Row - Waveform, Mic Button, and Call Indicators */}
                            <div className="flex items-center justify-between">
                                {/* Left Side - Waveform with Call Indicators */}
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center">
                                        <Waveform 
                                            isActive={callStatus === 'active'} 
                                            width={120} 
                                            height={40} 
                                        />
                                    </div>
                                    
                                    {/* Call Indicators - positioned at extreme right of waveform */}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${callStatus === 'active' ? 'bg-green-500 animate-pulse' :
                                            callStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                                                callStatus === 'ended' ? 'bg-red-400' : 'bg-gray-400'
                                            }`}></div>
                                        <span className={`font-medium ${getStatusColor()}`}>
                                            {getStatusText()}
                                        </span>
                                        {isConnecting && (
                                            <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side - Microphone Button */}
                                <button
                                    type="button"
                                    onClick={handleMicToggle}
                                    disabled={isConnecting}
                                    className={`p-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${callStatus === 'active'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-300 text-white'
                                        : isConnecting
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 focus:ring-yellow-300 text-white'
                                            : 'bg-gradient-to-r bg-[#5FCA89] text-white'
                                        }`}
                                    aria-label={callStatus === 'active' ? 'Stop voice session' : 'Start voice session'}
                                >
                                    <div className="relative">
                                        {isConnecting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : callStatus === 'active' ? (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 6h12v12H6z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                                                <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z" />
                                                <path d="M12 18v4m-4 0h8" />
                                            </svg>
                                        )}

                                        {/* Pulse animation for active state */}
                                        {callStatus === 'active' && (
                                            <div className="absolute inset-0 rounded-2xl bg-red-400 opacity-40 animate-ping"></div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}