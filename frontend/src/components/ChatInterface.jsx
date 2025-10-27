// frontend/src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { postChatMessage, getResults } from '../services/apiService'; // N-importiw l-service dyalna
import ResultsDisplay from './ResultsDisplay'; // Ghadi nqadoh men be3d

function ChatInterface() {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]); // Array dyal messages (AI o User)
    const [currentCriterionId, setCurrentCriterionId] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Kaybda loading f lewel
    const [error, setError] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [results, setResults] = useState(null); // Bach nkhebbiw nata2ij

    // Ref bach nbdaw scroll l l-kher dyal l-chat
    const chatEndRef = useRef(null);

    // Function dyal Scroll
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Nzid message f l-chat log
    const addMessage = (sender, text, criterionId = null) => {
        setMessages(prev => [...prev, { sender, text, criterionId }]);
    };

    // Function dyal demarrage (runs once)
    useEffect(() => {
        const startConversation = async () => {
            setError(null);
            setIsLoading(true);
            const newConvId = `conv-react-${Date.now()}`;
            setConversationId(newConvId);

            try {
                const data = await postChatMessage(newConvId, null);
                addMessage('ai', data.ai_question, data.current_criterion_id);
                setCurrentCriterionId(data.current_criterion_id);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        startConversation();
    }, []); // Run only once

    // Scroll melli kaytzad message jdid
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // Function dyal Submit dyal Jawab
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = userInput.trim();
        if (!answer || isLoading || isFinished) return;

        // Zid l-jawab dyal user l l-chat
        addMessage('user', answer);
        setUserInput(''); // Nkhwiw l-input
        setIsLoading(true);
        setError(null);

        try {
            const data = await postChatMessage(conversationId, answer);

            if (data.current_criterion_id === 'FINISHED') {
                addMessage('ai', data.ai_question); // L-message l-kher
                setIsFinished(true);
                // --- Fetch Results ---
                try {
                    const resultsData = await getResults(conversationId);
                    setResults(resultsData); // Khebbi nata2ij
                } catch (resultsError) {
                    setError(resultsError.message);
                }
                // --- End Fetch Results ---
            } else {
                addMessage('ai', data.ai_question, data.current_criterion_id);
                setCurrentCriterionId(data.current_criterion_id);
            }
        } catch (err) {
            setError(err.message);
            // Rje3 l-jawab dyal user ila wqe3 error bach yqder y3awed
            setUserInput(answer);
            setMessages(prev => prev.slice(0, -1)); // 7iyd l-jawab dyal user men l-chat
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container" style={styles.chatContainer}>
            <div className="message-list" style={styles.messageList}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.sender === 'ai' ? styles.aiMessage : styles.userMessage}>
                        <p style={styles.messageText}>
                            {msg.sender === 'ai' && msg.criterionId && <small style={styles.criterionLabel}>({msg.criterionId}) </small>}
                            {msg.text}
                        </p>
                    </div>
                ))}
                {/* Hada div khawi bach scroll ykhdem */}
                <div ref={chatEndRef} />
            </div>

            {isLoading && <p style={styles.loadingText}>DigiAssistant is thinking...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

            {!isFinished && !isLoading && (
                <form onSubmit={handleSubmit} style={styles.inputForm}>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={3}
                        style={styles.textArea}
                    />
                    <button type="submit" style={styles.sendButton} disabled={!userInput.trim()}>
                        Send
                    </button>
                </form>
            )}

            {isFinished && results && (
                // Hna fin ghadi n-afficheiw l-results component
                <ResultsDisplay results={results} />
            )}
            {isFinished && !results && !error && (
                <p style={styles.loadingText}>Generating your report...</p>
            )}
        </div>
    );
}

// Styles bassita (tqder tbdlhom b CSS file)
const styles = {
    chatContainer: {
        maxWidth: '700px',
        margin: '20px auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        height: '80vh', // Kayakhod 80% men tol dyal page
        backgroundColor: '#f9f9f9',
    },
    messageList: {
        flexGrow: 1, // Kayakhod l-blasa kamla
        overflowY: 'auto', // Kayzid scrollbar
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Espace bin messages
    },
    aiMessage: {
        alignSelf: 'flex-start', // Kayji 3la lisser
        backgroundColor: '#e5e5ea',
        borderRadius: '15px 15px 15px 5px',
        padding: '10px 15px',
        maxWidth: '75%',
    },
    userMessage: {
        alignSelf: 'flex-end', // Kayji 3la limen
        backgroundColor: '#007aff',
        color: 'white',
        borderRadius: '15px 15px 5px 15px',
        padding: '10px 15px',
        maxWidth: '75%',
    },
    messageText: {
        margin: 0,
        whiteSpace: 'pre-wrap', // Kay7tarem les sauts de ligne
    },
    criterionLabel: {
        color: '#666',
        fontSize: '0.8em',
        display: 'block', // Kayji f ster bohdo
        marginBottom: '3px',
    },
    inputForm: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ccc',
        backgroundColor: '#fff',
    },
    textArea: {
        flexGrow: 1,
        border: '1px solid #ccc',
        borderRadius: '18px',
        padding: '10px 15px',
        fontSize: '1em',
        resize: 'none', // Kaymne3 user ykberha
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 20px',
        backgroundColor: '#007aff',
        color: 'white',
        border: 'none',
        borderRadius: '18px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    loadingText: {
        textAlign: 'center',
        color: '#555',
        padding: '10px',
    },
};


export default ChatInterface;