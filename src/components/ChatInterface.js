'use client';

import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';

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
        const vapiInstance = new Vapi("2cd93cfc-2714-4bec-9d41-de9152891e0a");
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
            addMessage('🎤 You are speaking...', 'user');
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
                    addMessage(message.transcript, 'ai');
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

    const startCall = async () => {
        if (!vapi) return;

        setIsConnecting(true);
        setCallStatus('connecting');

        try {
            const assistant = {
                name: "Anita",
                firstMessage: "Hello! I'm Anita, your virtual assistant for the M-CHAT-R assessment. I'll be asking you a series of questions about your child's behavior and development. Please answer as accurately as possible. Let's get started!",
                transcriber: {
                    model: "gemini-2.0-flash",
                    language: "Multilingual",
                    provider: "google"
                },
                voice: {
                    model: "speech-02-turbo",
                    pitch: 0,
                    speed: 1.2,
                    region: "worldwide",
                    volume: 1,
                    voiceId: "vapi_yoshita_pvc_voice_v1",
                    provider: "minimax",
                    languageBoost: "Hindi",
                    textNormalizationEnabled: true
                },
                model: {
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `
You are ANITA, a warm, empathetic, and motivating female assistant designed to guide parents through an autism screening for their child using the M-CHAT-R questions. 

Your role:
- Speak naturally and conversationally, not like a robot. 
- Be empathetic and reassuring. Show understanding of the parent's feelings and encourage them that their participation is valuable for their child's growth. 
- Stay motivating: express excitement when parents respond, and gently encourage them to continue. 
- Always stay focused on the autism evaluation. If parents ask anything out of context, respond with: 
  "I'm not allowed to speak on that matter. I'm here to help evaluate your child's development." 

How you should behave:
- Introduce yourself as: "Hi, I'm Anita. I'll be guiding you with some simple questions about your child's development." 
- Ask questions one by one in a natural flow. 
- Personalize each question with the child's name when possible. 
- Listen to the parent's response, then either acknowledge it empathetically or continue with the next question.
- Avoid asking multiple questions at once. Stay structured but warm.

The sequence of questions you must ask (one at a time, naturally in conversation):

1. "If you point at something across the room—say a toy or an animal—does ${childName} look at it?"
2. "Have you ever wondered if ${childName} might be deaf?"
3. "Does ${childName} engage in pretend or make-believe play? For example, pretending to drink from an empty cup or feeding a doll."
4. "Does ${childName} like climbing on things—furniture, playground equipment, or stairs?"
5. "Does ${childName} make unusual finger movements near their eyes—like wiggling fingers close to their face?"
6. "Does ${childName} point with one finger to ask for something or get help—like pointing to a snack out of reach?"
7. "Does ${childName} point with one finger to show you something interesting—like an airplane or big truck?" 
8. "Is ${childName} interested in other children—watching them, smiling at them, or going to them?"
9. "Does ${childName} ever bring something to you or hold it up for you just to share—not because they need help?"
10. "When you call ${childName}'s name, do they respond—by looking up, babbling, or stopping what they're doing?"
11. "When you smile at ${childName}, do they smile back at you?"
12. "Does ${childName} get upset by everyday noises—like a vacuum cleaner or loud music?"
13. "Does ${childName} walk?"
14. "Does ${childName} look you in the eye when you're talking to them, playing with them, or dressing them?"
15. "Does ${childName} try to copy what you do—like waving bye-bye, clapping, or making funny noises?"
16. "If you turn your head to look at something, does ${childName} follow your gaze and look around at what you're looking at?"
17. "Does ${childName} try to get you to watch them—looking at you for praise or saying 'look' or 'watch me'?"
18. "Does ${childName} understand when you tell them to do something without pointing—like 'put the book on the chair'?"
19. "If something new happens, does ${childName} look at your face to see how you feel about it—like hearing a strange noise?"
20. "Does ${childName} like movement activities—being swung or bounced on your knee?"

Always: 
- Thank the parent after each response.
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
        <div className="min-h-screen bg-gradient-to-br bg-[#e98ea93d] flex items-center justify-center py-10">
            <div className="container mx-auto max-w-5xl  p-6">

                {/* Main Assessment Interface */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Assessment Header */}
                    <div className="bg-gradient-to-r bg-[#e98ea98c] text-white px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Voice Assessment Session</h2>
                                <p className="text-blue-100 text-sm">
                                    Answer questions about your child&#39;s behavior and development
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    {/* Messages Area with Enhanced Styling and Auto-scroll */}
                    <div id="messages-container" className="h-100 overflow-y-auto bg-gradient-to-b from-gray-50 to-white scroll-smooth">
                        <div className="p-6 space-y-6">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'ai' || message.type === 'system' || message.type === 'error' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex flex-col max-w-xs lg:max-w-md ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                        {/* Enhanced Message Bubble */}
                                        <div className={`relative px-6 py-4 rounded-2xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${getMessageStyle(message.type)}`}>
                                            {/* Message Header */}
                                            <div className="flex items-center mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wide">
                                                    {getMessageIcon(message.type)}
                                                </span>
                                            </div>
                                            {/* Message Content */}
                                            <p className="text-sm leading-relaxed font-medium">{message.text}</p>

                                            {/* Message Tail */}
                                            <div className={`absolute w-0 h-0 ${message.type === 'user'
                                                ? 'right-0 top-4 border-l-8 border-l-green-200 border-t-8 border-t-transparent border-b-8 border-b-transparent transform translate-x-2'
                                                : 'left-0 top-4 border-r-8 border-r-blue-200 border-t-8 border-t-transparent border-b-8 border-b-transparent transform -translate-x-2'
                                                }`}></div>
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

                    {/* Seamless Input Area at Bottom */}
                    <div className="bg-white border-t border-gray-200 p-6">
                        <form onSubmit={handleTextSubmit} className="flex items-center space-x-3">
                            <div className="flex-1 relative">
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
                                    className="w-full px-6 py-4 pr-16 text-base border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 shadow-sm bg-gray-50 hover:bg-white"
                                />
                                {/* Clear Text Button */}
                                {textInput && (
                                    <button
                                        type="button"
                                        onClick={() => setTextInput('')}
                                        className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Inline Microphone Button */}
                            <button
                                type="button"
                                onClick={handleMicToggle}
                                disabled={isConnecting}
                                className={`p-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${callStatus === 'active'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-300 text-white'
                                    : isConnecting
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 focus:ring-yellow-300 text-white'
                                        : 'bg-gradient-to-r bg-[#c4476cb2] text-white'
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

                            {/* Send Button (only show when there's text) */}
                            {textInput.trim() && (
                                <button
                                    type="submit"
                                    className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                                    aria-label="Send message"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            )}
                        </form>

                        {/* Status Indicator */}
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${callStatus === 'active' ? 'bg-green-500 animate-pulse' :
                                    callStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                                        callStatus === 'ended' ? 'bg-red-400' : 'bg-gray-400'
                                    }`}></div>
                                <span className={`font-medium ${getStatusColor()}`}>
                                    {getStatusText()}
                                </span>
                            </div>

                            
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}