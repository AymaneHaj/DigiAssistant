import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ChatWindow (Dumb Component)
 * Renders the list of messages and the input box.
 * Handles auto-scrolling to the bottom.
 */
const TOTAL_QUESTIONS = 72; // Total number of diagnostic questions

export default function ChatWindow({ history, isLoading, onSendMessage }) {
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom when history changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Calculate progress: count answered questions (user messages)
    const answeredQuestions = history.filter(msg => msg.role === 'user').length;
    const progressPercentage = Math.min(Math.round((answeredQuestions / TOTAL_QUESTIONS) * 100), 100);

    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-200/50">

            {/* Progress Bar */}
            <div className="px-6 pt-4 pb-3 bg-gradient-to-r from-primary-50/50 via-white to-blue-50/50 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#343A40]">
                        Progression du diagnostic
                    </span>
                    <span className="text-sm font-bold text-[#008C9E]">
                        {progressPercentage}%
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#008C9E] to-[#006b7a] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-500">
                        {answeredQuestions} / {TOTAL_QUESTIONS} questions répondues
                    </span>
                    <span className="text-xs text-gray-500">
                        {TOTAL_QUESTIONS - answeredQuestions} restantes
                    </span>
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-gray-100 hover:scrollbar-thumb-primary-400">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        </div>
                        <p className="text-sm font-medium">Starting conversation...</p>
                    </div>
                ) : (
                    <>
                        {history.map((msg, index) => (
                            <ChatBubble
                                key={index}
                                role={msg.role}
                                content={msg.content}
                                score={msg.score}
                                evaluation={msg.evaluation}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                                <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm bg-white border border-gray-200/50 shadow-md">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* This empty div is the target for auto-scrolling */}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200/50 bg-gradient-to-r from-primary-50/30 via-white to-blue-50/30 backdrop-blur-sm p-5">
                <ChatInput onSend={onSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
}