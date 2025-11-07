import { useState, useRef, useEffect } from 'react';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ChatBubble (Dumb Component)
 * Renders a single message bubble.
 * Styles itself differently based on the 'role' (ai or user).
 */
export default function ChatBubble({ role, content, score, evaluation }) {
    const isUser = role === 'user';
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        // Check if Speech Synthesis is supported
        try {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                setIsSupported(true);
            }
        } catch (error) {
            console.warn('Speech synthesis not supported:', error);
            setIsSupported(false);
        }

        // Cleanup on unmount
        return () => {
            try {
                if (typeof window !== 'undefined' && window.speechSynthesis && utteranceRef.current) {
                    window.speechSynthesis.cancel();
                }
            } catch (error) {
                console.warn('Error cleaning up speech synthesis:', error);
            }
        };
    }, []);

    const speakText = () => {
        try {
            if (!isSupported || typeof window === 'undefined' || !window.speechSynthesis) {
                alert('La synthèse vocale n\'est pas supportée par votre navigateur.');
                return;
            }

            // Stop any ongoing speech
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                return;
            }

            // Create new utterance
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.lang = 'fr-FR'; // French language
            utterance.rate = 0.9; // Slightly slower for better understanding
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setIsSpeaking(false);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error in speakText:', error);
            alert('Erreur lors de la lecture vocale. Veuillez réessayer.');
            setIsSpeaking(false);
        }
    };

    const bubbleVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: 'spring',
                damping: 20,
                stiffness: 300,
                duration: 0.4
            } 
        },
    };

    return (
        <motion.div
            className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
        >
            {/* AI Icon */}
            {!isUser && (
                <motion.div 
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <Bot className="w-5 h-5 text-white" />
                </motion.div>
            )}

            {/* Message Content */}
            <div className="relative">
                <motion.div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3.5 rounded-2xl shadow-md backdrop-blur-sm ${isUser
                            ? 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200/50'
                        }`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                    
                    {/* Show score for user messages */}
                    {isUser && (score !== undefined || evaluation?.score !== undefined) && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                            <span className="text-xs font-semibold opacity-90">Score:</span>
                            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                                {score !== undefined ? score : evaluation?.score}/3
                            </span>
                        </div>
                    )}
                </motion.div>
                
                {/* Audio Button for AI messages */}
                {!isUser && isSupported && (
                    <motion.button
                        onClick={speakText}
                        className={`absolute -right-10 top-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                            isSpeaking 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={isSpeaking ? 'Arrêter la lecture' : 'Lire le message'}
                    >
                        {isSpeaking ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </motion.button>
                )}
            </div>


            {/* User Icon */}
            {isUser && (
                <motion.div 
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 via-accent-400 to-accent-600 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <User className="w-5 h-5 text-white" />
                </motion.div>
            )}
        </motion.div>
    );
}