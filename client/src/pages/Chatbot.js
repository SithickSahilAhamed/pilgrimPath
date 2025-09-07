import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  MapPin,
  AlertTriangle,
  Clock,
  Globe
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState({});
  const messagesEndRef = useRef(null);
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load emergency contacts
    const loadEmergencyContacts = async () => {
      try {
        const response = await axios.get('/api/chatbot/emergency-contacts');
        setEmergencyContacts(response.data);
      } catch (error) {
        console.error('Failed to load emergency contacts:', error);
      }
    };

    loadEmergencyContacts();

    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        message: `Hello! I'm here to help you with your pilgrimage journey. How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot/chat', {
        message: inputMessage,
        language: currentLanguage
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to get response from chatbot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      text: 'Find directions',
      icon: MapPin,
      action: () => setInputMessage('I need directions to the temple')
    },
    {
      text: 'Report emergency',
      icon: AlertTriangle,
      action: () => setInputMessage('I need emergency help')
    },
    {
      text: 'Find facilities',
      icon: Clock,
      action: () => setInputMessage('Where can I find restrooms and water?')
    },
    {
      text: 'Transport help',
      icon: Globe,
      action: () => setInputMessage('I need help with transport booking')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multilingual Help Assistant</h1>
          <p className="text-gray-600">Get instant help in your preferred language</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">PilgrimPath Assistant</h3>
                    <p className="text-sm text-gray-600">Available 24/7 to help you</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span className="text-sm">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="flex items-center justify-center space-x-2 p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{action.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('askQuestion')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                {t('emergencyContacts')}
              </h3>
              <div className="space-y-3">
                {Object.entries(emergencyContacts).map(([service, number]) => (
                  <div key={service} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <a
                      href={`tel:${number}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      {number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Support</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="text-sm text-gray-600">English</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm text-gray-600">हिन्दी (Hindi)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm text-gray-600">தமிழ் (Tamil)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                The assistant automatically detects your preferred language and responds accordingly.
              </p>
            </div>

            {/* Help Topics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Topics</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setInputMessage('How do I book transport?')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Transport Booking
                </button>
                <button
                  onClick={() => setInputMessage('Where can I find accommodation?')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Accommodation
                </button>
                <button
                  onClick={() => setInputMessage('What facilities are available?')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Facilities & Services
                </button>
                <button
                  onClick={() => setInputMessage('How do I report an issue?')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Report Issues
                </button>
                <button
                  onClick={() => setInputMessage('What are the safety guidelines?')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Safety Guidelines
                </button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Language:</strong> {currentLanguage.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {user.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
