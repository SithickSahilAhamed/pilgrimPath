const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simple chatbot responses - in real app, this would integrate with AI service
const chatbotResponses = {
  en: {
    greetings: [
      "Hello! How can I help you today?",
      "Hi there! What do you need assistance with?",
      "Welcome! I'm here to help with your pilgrimage journey."
    ],
    emergency: [
      "For emergencies, please call the emergency helpline immediately.",
      "Emergency services are available 24/7. Please contact the nearest help desk.",
      "If this is a medical emergency, please seek immediate medical attention."
    ],
    directions: [
      "I can help you find directions. Please tell me your current location and destination.",
      "For navigation assistance, please provide your starting point and where you want to go.",
      "I'll help you with directions. What's your current location?"
    ],
    facilities: [
      "Facilities include medical centers, food stalls, restrooms, and water stations.",
      "You can find medical aid, food, and other facilities at designated points throughout the area.",
      "Various facilities are available including medical, food, and sanitation services."
    ],
    transport: [
      "Transport options include shuttle buses, e-rickshaws, and walking routes.",
      "You can book transport through the app or find available vehicles at designated points.",
      "Multiple transport options are available. Check the transport section for booking."
    ],
    accommodation: [
      "Accommodation options include rooms, tents, and homestays. Check the booking section.",
      "You can find various accommodation options through the app's booking system.",
      "Accommodation is available in different price ranges. Browse the options in the app."
    ],
    default: [
      "I understand you need help. Could you please be more specific?",
      "I'm here to assist you. Can you provide more details about what you need?",
      "Let me help you with that. Could you clarify your question?"
    ]
  },
  hi: {
    greetings: [
      "नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?",
      "हैलो! आपको किस तरह की सहायता चाहिए?",
      "स्वागत है! मैं आपकी तीर्थ यात्रा में मदद के लिए यहां हूं।"
    ],
    emergency: [
      "आपातकाल के लिए, कृपया तुरंत आपातकालीन हेल्पलाइन पर कॉल करें।",
      "आपातकालीन सेवाएं 24/7 उपलब्ध हैं। कृपया निकटतम हेल्प डेस्क से संपर्क करें।",
      "यदि यह चिकित्सा आपातकाल है, तो कृपया तुरंत चिकित्सा सहायता लें।"
    ],
    directions: [
      "मैं आपको रास्ता खोजने में मदद कर सकता हूं। कृपया अपना वर्तमान स्थान और गंतव्य बताएं।",
      "नेविगेशन सहायता के लिए, कृपया अपना शुरुआती बिंदु और जहां जाना चाहते हैं वह बताएं।",
      "मैं आपको दिशा-निर्देश में मदद करूंगा। आपका वर्तमान स्थान क्या है?"
    ],
    facilities: [
      "सुविधाओं में चिकित्सा केंद्र, खाद्य स्टॉल, शौचालय और जल स्टेशन शामिल हैं।",
      "आप क्षेत्र भर में निर्दिष्ट बिंदुओं पर चिकित्सा सहायता, भोजन और अन्य सुविधाएं पा सकते हैं।",
      "विभिन्न सुविधाएं उपलब्ध हैं जिनमें चिकित्सा, भोजन और स्वच्छता सेवाएं शामिल हैं।"
    ],
    transport: [
      "परिवहन विकल्पों में शटल बसें, ई-रिक्शा और पैदल मार्ग शामिल हैं।",
      "आप ऐप के माध्यम से परिवहन बुक कर सकते हैं या निर्दिष्ट बिंदुओं पर उपलब्ध वाहन खोज सकते हैं।",
      "कई परिवहन विकल्प उपलब्ध हैं। बुकिंग के लिए परिवहन अनुभाग देखें।"
    ],
    accommodation: [
      "आवास विकल्पों में कमरे, तंबू और होमस्टे शामिल हैं। बुकिंग अनुभाग देखें।",
      "आप ऐप की बुकिंग प्रणाली के माध्यम से विभिन्न आवास विकल्प पा सकते हैं।",
      "विभिन्न मूल्य सीमाओं में आवास उपलब्ध है। ऐप में विकल्पों को ब्राउज़ करें।"
    ],
    default: [
      "मैं समझता हूं कि आपको मदद चाहिए। कृपया और विशिष्ट हो सकते हैं?",
      "मैं आपकी सहायता के लिए यहां हूं। क्या आप अपनी आवश्यकता के बारे में अधिक विवरण दे सकते हैं?",
      "मुझे आपकी मदद करने दें। क्या आप अपने प्रश्न को स्पष्ट कर सकते हैं?"
    ]
  },
  ta: {
    greetings: [
      "வணக்கம்! இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
      "ஹலோ! உங்களுக்கு என்ன உதவி தேவை?",
      "வரவேற்கிறோம்! உங்கள் திருத்தல பயணத்தில் உதவ நான் இங்கே இருக்கிறேன்."
    ],
    emergency: [
      "அவசரநிலைக்கு, உடனடியாக அவசரநிலை உதவி எண்ணை அழைக்கவும்.",
      "அவசரநிலை சேவைகள் 24/7 கிடைக்கின்றன. அருகிலுள்ள உதவி மேசையைத் தொடர்பு கொள்ளவும்.",
      "இது மருத்துவ அவசரநிலை என்றால், உடனடியாக மருத்துவ உதவியைத் தேடுங்கள்."
    ],
    directions: [
      "வழிகாட்டுதலைக் கண்டறிய நான் உதவ முடியும். உங்கள் தற்போதைய இடம் மற்றும் இலக்கைக் கூறுங்கள்.",
      "வழிகாட்டுதல் உதவிக்கு, உங்கள் தொடக்கப் புள்ளி மற்றும் நீங்கள் செல்ல விரும்பும் இடத்தை வழங்கவும்.",
      "வழிகாட்டுதலில் உதவுவேன். உங்கள் தற்போதைய இடம் என்ன?"
    ],
    facilities: [
      "வசதிகளில் மருத்துவ மையங்கள், உணவு கடைகள், கழிப்பறைகள் மற்றும் நீர் நிலையங்கள் உள்ளன.",
      "பகுதி முழுவதும் நியமிக்கப்பட்ட புள்ளிகளில் மருத்துவ உதவி, உணவு மற்றும் பிற வசதிகளைக் காணலாம்.",
      "மருத்துவம், உணவு மற்றும் சுகாதார சேவைகள் உட்பட பல்வேறு வசதிகள் கிடைக்கின்றன."
    ],
    transport: [
      "போக்குவரத்து விருப்பங்களில் ஷட்டில் பஸ்கள், மின் ரிக்ஷாக்கள் மற்றும் நடை பாதைகள் உள்ளன.",
      "ஆப்பின் மூலம் போக்குவரத்தை பதிவு செய்யலாம் அல்லது நியமிக்கப்பட்ட புள்ளிகளில் கிடைக்கும் வாகனங்களைக் காணலாம்.",
      "பல போக்குவரத்து விருப்பங்கள் கிடைக்கின்றன. பதிவுக்கு போக்குவரத்து பிரிவைப் பார்க்கவும்."
    ],
    accommodation: [
      "வசிப்பிட விருப்பங்களில் அறைகள், கூடாரங்கள் மற்றும் வீட்டு தங்குதல் உள்ளன. பதிவு பிரிவைப் பார்க்கவும்.",
      "ஆப்பின் பதிவு அமைப்பின் மூலம் பல்வேறு வசிப்பிட விருப்பங்களைக் காணலாம்.",
      "வெவ்வேறு விலை வரம்புகளில் வசிப்பிடம் கிடைக்கிறது. ஆப்பில் விருப்பங்களை உலாவுங்கள்."
    ],
    default: [
      "உங்களுக்கு உதவி தேவை என்பதை நான் புரிந்துகொள்கிறேன். தயவுசெய்து மேலும் குறிப்பிட்டதாக இருக்கலாமா?",
      "உங்களுக்கு உதவ நான் இங்கே இருக்கிறேன். உங்களுக்கு என்ன தேவை என்பதைப் பற்றி மேலும் விவரங்களை வழங்க முடியுமா?",
      "அதில் உதவட்டும். உங்கள் கேள்வியை தெளிவுபடுத்த முடியுமா?"
    ]
  }
};

// Get chatbot response
router.post('/chat', auth, [
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('language').optional().isIn(['en', 'hi', 'ta'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, language = 'en' } = req.body;
    const user = req.user;

    const responses = chatbotResponses[language] || chatbotResponses.en;
    
    // Simple keyword matching - in real app, this would use NLP
    const lowerMessage = message.toLowerCase();
    let responseCategory = 'default';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste') || lowerMessage.includes('வணக்கம்')) {
      responseCategory = 'greetings';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent') || lowerMessage.includes('आपातकाल') || lowerMessage.includes('அவசரநிலை')) {
      responseCategory = 'emergency';
    } else if (lowerMessage.includes('direction') || lowerMessage.includes('way') || lowerMessage.includes('route') || lowerMessage.includes('रास्ता') || lowerMessage.includes('வழி')) {
      responseCategory = 'directions';
    } else if (lowerMessage.includes('facility') || lowerMessage.includes('toilet') || lowerMessage.includes('water') || lowerMessage.includes('सुविधा') || lowerMessage.includes('வசதி')) {
      responseCategory = 'facilities';
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('bus') || lowerMessage.includes('vehicle') || lowerMessage.includes('परिवहन') || lowerMessage.includes('போக்குவரத்து')) {
      responseCategory = 'transport';
    } else if (lowerMessage.includes('room') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation') || lowerMessage.includes('आवास') || lowerMessage.includes('வசிப்பிடம்')) {
      responseCategory = 'accommodation';
    }

    const possibleResponses = responses[responseCategory];
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    // Log the conversation
    console.log(`Chatbot - User: ${user.name} (${user.language}), Message: ${message}, Response: ${response}`);

    res.json({
      response,
      category: responseCategory,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get emergency contacts
router.get('/emergency-contacts', async (req, res) => {
  try {
    const contacts = {
      police: '100',
      ambulance: '108',
      fire: '101',
      helpline: '1800-123-4567',
      localAdmin: '+91-9876543210'
    };

    res.json(contacts);
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
