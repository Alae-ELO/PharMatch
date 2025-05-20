import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';

const ChatPage: React.FC = () => {
  const { messages, sendMessage } = useStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsSending(true);
    await sendMessage(inputMessage);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Assistant</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ask health-related questions and get reliable information from our AI assistant.
        </p>
      </div>

      {/* Chat Interface */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot className="h-12 w-12 mb-4 text-cyan-600" />
                <h3 className="text-lg font-medium mb-2">Health Assistant</h3>
                <p className="max-w-sm">
                  Ask me anything about medications, symptoms, or general health advice.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button 
                    className="text-left px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                    onClick={() => setInputMessage("What are the side effects of ibuprofen?")}
                  >
                    What are the side effects of ibuprofen?
                  </button>
                  <button 
                    className="text-left px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                    onClick={() => setInputMessage("How often can I take acetaminophen?")}
                  >
                    How often can I take acetaminophen?
                  </button>
                  <button 
                    className="text-left px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                    onClick={() => setInputMessage("What's the difference between a cold and the flu?")}
                  >
                    What's the difference between a cold and the flu?
                  </button>
                  <button 
                    className="text-left px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                    onClick={() => setInputMessage("How do I treat a minor burn?")}
                  >
                    How do I treat a minor burn?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
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
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
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
                placeholder="Type your health question..."
                className="flex-grow"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !inputMessage.trim()}
                isLoading={isSending}
                icon={<Send className="h-4 w-4" />}
              >
                Send
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: This assistant provides general information only. Always consult a healthcare professional for personal medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;