import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, ChevronUp } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Define Message type if it's not available for import
type Message = {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  isTyping?: boolean;
};

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages if user is logged in
  useEffect(() => {
    if (token && user) {
      loadLatestConversation();
    }
  }, [token, user]);

  // Only scroll to bottom when a new message is added
  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages]);

  const loadLatestConversation = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/conversations?limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const latestConversation = response.data.data[0];
        setConversationId(latestConversation.id);
        loadConversation(latestConversation.id);
      }
    } catch (error) {
      console.error('Error loading latest conversation:', error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/conversations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const messages = response.data.data.messages;
        
        // Only show the last 10 messages initially
        const lastMessages = messages.slice(Math.max(0, messages.length - 10));
        
        setChatMessages(lastMessages.map((msg: Message) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp
        })));
        
        // Set flag if there are more messages to load
        setHasMoreMessages(messages.length > 10);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!conversationId || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const allMessages = response.data.data.messages;
        const currentCount = chatMessages.length;
        const nextBatch = 10;
        
        // Calculate how many more messages to load
        const startIndex = Math.max(0, allMessages.length - (currentCount + nextBatch));
        const endIndex = allMessages.length - currentCount;
        
        // Get the next batch of messages
        const olderMessages = allMessages.slice(startIndex, endIndex);
        
        if (olderMessages.length > 0) {
          // Add older messages to the beginning of the chat
          setChatMessages(prev => [
            ...olderMessages.map((msg: Message) => ({
              id: msg.id,
              sender: msg.sender,
              content: msg.content,
              timestamp: msg.timestamp
            })),
            ...prev
          ]);
        }
        
        // Update whether there are more messages to load
        setHasMoreMessages(startIndex > 0);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    setIsSending(true);
    
    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages((prev: Array<Message>) => [...prev, userMessage as Message]);
    
    // Add temporary AI "typing" message
    const typingId = `ai-typing-${Date.now()}`;
    setChatMessages(prev => [...prev, {
      id: typingId,
      sender: 'ai',
      content: '...',
      timestamp: new Date().toISOString(),
      isTyping: true
    }]);
    
    try {
      // Call backend API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat`,
        { 
          message: inputMessage,
          conversationId: conversationId,
          userId: user.id // Add user ID to request body
        },

        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        }
      );
      
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => msg.id !== typingId));
      
      // Add AI response
      const aiResponse = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: response.data.response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, aiResponse as Message]);
      
      // Update conversation ID if this is a new conversation
      if (response.data.conversationId && !conversationId) {
        setConversationId(response.data.conversationId);
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => msg.id !== typingId));
      
      // Add error message
      const errorResponse = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, errorResponse as Message]);
    }
    
    setInputMessage('');
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('health_assistant')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('ask_health_questions')}</p>
      </div>

      {/* Chat Interface */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-4">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot className="h-12 w-12 mb-4 text-cyan-600" />
                <h3 className="text-lg font-medium mb-2">{t('health_assistant')}</h3>
                <p className="max-w-sm">{t('chat_welcome_message')}</p>
              </div>
            ) : (
              <>
                {hasMoreMessages && (
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={loadMoreMessages}
                      disabled={isLoadingMore}
                      isLoading={isLoadingMore}
                      variant="outline"
                      size="sm"
                      icon={<ChevronUp className="h-4 w-4" />}
                    >
                      {t('load_more')}
                    </Button>
                  </div>
                )}
                
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {(message as { isTyping?: boolean }).isTyping ? (
                        <div className="flex items-center space-x-1 py-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('type_health_question')}
                className="flex-grow"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !inputMessage.trim()}
                isLoading={isSending}
                icon={<Send className="h-4 w-4" />}
              >
                {t('send')}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('disclaimer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
