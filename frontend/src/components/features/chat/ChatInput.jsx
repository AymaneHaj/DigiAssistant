import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ChatInput (Dumb Component)
 * Renders the form for sending a new message.
 */
export default function ChatInput({ onSend, isLoading }) {
    const [message, setMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    // Check if Speech Recognition is supported
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'fr-FR'; // French language

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                if (event.error === 'no-speech') {
                    alert('Aucune parole détectée. Veuillez réessayer.');
                } else if (event.error === 'not-allowed') {
                    alert('Permission microphone refusée. Veuillez autoriser l\'accès au microphone.');
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            stopListening(); // Stop listening if active
            onSend(message);
            setMessage(''); // Clear input after sending
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1 relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        // Send on Enter, new line on Shift+Enter
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    rows="1"
                    className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-200 px-4 py-3 text-sm placeholder:text-gray-400"
                    placeholder={isLoading ? 'Thinking...' : isListening ? '🎤 Écoute en cours...' : 'Tapez votre réponse ou utilisez le microphone...'}
                    disabled={isLoading || isListening}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                {isListening && (
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-500 font-medium">Enregistrement...</span>
                    </div>
                )}
            </div>
            
            {/* Microphone Button */}
            {isSupported && (
                <motion.button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className={`
                        flex-shrink-0
                        w-12 h-12
                        rounded-full
                        ${isListening 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }
                        text-white
                        shadow-lg
                        hover:shadow-xl
                        transition-all duration-200
                        flex items-center justify-center
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    `}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    title={isListening ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement vocal'}
                >
                    {isListening ? (
                        <MicOff className="w-5 h-5" />
                    ) : (
                        <Mic className="w-5 h-5 text-gray-700" />
                    )}
                </motion.button>
            )}

            {/* Send Button */}
            <motion.button
                type="submit"
                disabled={isLoading || !message.trim() || isListening}
                className={`
                    flex-shrink-0
                    w-12 h-12
                    rounded-full
                    bg-gradient-to-r from-primary-600 to-primary-700
                    hover:from-primary-700 hover:to-primary-800
                    text-white
                    shadow-lg
                    hover:shadow-xl
                    transition-all duration-200
                    flex items-center justify-center
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:shadow-lg
                `}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
            </motion.button>
        </form>
    );
}