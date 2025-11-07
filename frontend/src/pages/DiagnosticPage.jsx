import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resumeOrStartChat, sendMessage } from '../store/chatSlice';
import Spinner from '../components/common/Spinner';
import ChatWindow from '../components/features/chat/ChatWindow';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select state from Redux (chat & auth)
  const {
    conversationId,
    history,
    isLoading,
    error,
    isFinished,
    isInitializing
  } = useSelector((state) => state.chat);

  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. On Mount: Resume or start a new chat session
  // Only run once when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && !conversationId && !isInitializing && history.length === 0) {
      dispatch(resumeOrStartChat());
    }
  }, [dispatch, isAuthenticated, conversationId, isInitializing]); // Removed history.length to prevent dependency array size changes

  // 2. On Finish: Navigate to results page
  useEffect(() => {
    if (isFinished && conversationId) {
      // Navigate to the results page for this specific conversation
      navigate(`/results/${conversationId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, conversationId]); // navigate is stable, no need to include it

  // 3. Handle Send Message
  const handleSendMessage = (userAnswer) => {
    if (!userAnswer.trim() || isLoading) return;

    dispatch(sendMessage({
      conversationId,
      userAnswer,
      isStart: false
    }));
  };

  // 4. Handle Retry
  const handleRetry = () => {
    dispatch(resumeOrStartChat());
  };

  // --- Render Logic ---

  // Show full-page spinner ONLY on initial load
  if (isLoading && history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center h-[60vh]"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
        <motion.p 
          className="mt-8 text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading your session...
        </motion.p>
        <motion.p 
          className="mt-2 text-sm text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Please wait while we prepare your diagnostic
        </motion.p>
      </motion.div>
    );
  }

  // Show error message if something fails
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-lg mx-auto mt-12"
      >
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 p-8 border-2 border-red-200/50 text-center shadow-xl backdrop-blur-sm">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
          </motion.div>
          <motion.h3 
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Oops! Something went wrong
          </motion.h3>
          <motion.p 
            className="text-sm text-gray-600 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {error}
          </motion.p>

          <motion.button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <motion.p 
            className="mt-6 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            If the problem persists, please contact support
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Render the chat window
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <ChatWindow
        history={history}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}