import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const languages = {
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸'
  },
  hi: {
    name: 'हिन्दी',
    code: 'hi',
    flag: '🇮🇳'
  },
  ta: {
    name: 'தமிழ்',
    code: 'ta',
    flag: '🇮🇳'
  }
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    map: 'Map',
    bookings: 'Bookings',
    complaints: 'Complaints',
    chatbot: 'Help',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    
    // Home page
    welcome: 'Welcome to PilgrimPath',
    searchPlaceholder: 'Search destination or location...',
    liveAlerts: 'Live Alerts',
    quickActions: 'Quick Actions',
    reportIssue: 'Report Issue',
    bookTransport: 'Book Transport',
    findAccommodation: 'Find Accommodation',
    emergencyHelp: 'Emergency Help',
    
    // Map
    crowdDensity: 'Crowd Density',
    green: 'Low',
    yellow: 'Medium',
    red: 'High',
    suggestedRoutes: 'Suggested Routes',
    liveUpdates: 'Live Updates',
    
    // Bookings
    transport: 'Transport',
    accommodation: 'Accommodation',
    myBookings: 'My Bookings',
    bookNow: 'Book Now',
    from: 'From',
    to: 'To',
    date: 'Date',
    time: 'Time',
    passengers: 'Passengers',
    
    // Complaints
    reportComplaint: 'Report Complaint',
    category: 'Category',
    priority: 'Priority',
    description: 'Description',
    location: 'Location',
    submit: 'Submit',
    
    // Chatbot
    askQuestion: 'Ask a question...',
    send: 'Send',
    emergencyContacts: 'Emergency Contacts',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    status: 'Status',
    priority: 'Priority',
    date: 'Date',
    time: 'Time'
  },
  hi: {
    // Navigation
    home: 'होम',
    map: 'नक्शा',
    bookings: 'बुकिंग',
    complaints: 'शिकायतें',
    chatbot: 'सहायता',
    admin: 'एडमिन',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    register: 'रजिस्टर',
    
    // Home page
    welcome: 'पिलग्रिमपाथ में आपका स्वागत है',
    searchPlaceholder: 'गंतव्य या स्थान खोजें...',
    liveAlerts: 'लाइव अलर्ट',
    quickActions: 'त्वरित कार्य',
    reportIssue: 'समस्या रिपोर्ट करें',
    bookTransport: 'परिवहन बुक करें',
    findAccommodation: 'आवास खोजें',
    emergencyHelp: 'आपातकालीन सहायता',
    
    // Map
    crowdDensity: 'भीड़ का घनत्व',
    green: 'कम',
    yellow: 'मध्यम',
    red: 'अधिक',
    suggestedRoutes: 'सुझाए गए मार्ग',
    liveUpdates: 'लाइव अपडेट',
    
    // Bookings
    transport: 'परिवहन',
    accommodation: 'आवास',
    myBookings: 'मेरी बुकिंग',
    bookNow: 'अभी बुक करें',
    from: 'से',
    to: 'तक',
    date: 'तारीख',
    time: 'समय',
    passengers: 'यात्री',
    
    // Complaints
    reportComplaint: 'शिकायत दर्ज करें',
    category: 'श्रेणी',
    priority: 'प्राथमिकता',
    description: 'विवरण',
    location: 'स्थान',
    submit: 'जमा करें',
    
    // Chatbot
    askQuestion: 'प्रश्न पूछें...',
    send: 'भेजें',
    emergencyContacts: 'आपातकालीन संपर्क',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    view: 'देखें',
    status: 'स्थिति',
    priority: 'प्राथमिकता',
    date: 'तारीख',
    time: 'समय'
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    map: 'வரைபடம்',
    bookings: 'முன்பதிவுகள்',
    complaints: 'புகார்கள்',
    chatbot: 'உதவி',
    admin: 'நிர்வாகம்',
    login: 'உள்நுழைவு',
    logout: 'வெளியேறு',
    register: 'பதிவு',
    
    // Home page
    welcome: 'பில்க்ரிம்பாத்துக்கு வரவேற்கிறோம்',
    searchPlaceholder: 'இலக்கு அல்லது இடத்தைத் தேடுங்கள்...',
    liveAlerts: 'நேரடி அறிவிப்புகள்',
    quickActions: 'விரைவு செயல்கள்',
    reportIssue: 'பிரச்சினையைப் புகாரளிக்கவும்',
    bookTransport: 'போக்குவரத்தை முன்பதிவு செய்யுங்கள்',
    findAccommodation: 'வசிப்பிடத்தைக் கண்டறியுங்கள்',
    emergencyHelp: 'அவசர உதவி',
    
    // Map
    crowdDensity: 'கூட்டத்தின் அடர்த்தி',
    green: 'குறைவு',
    yellow: 'நடுத்தரம்',
    red: 'அதிகம்',
    suggestedRoutes: 'பரிந்துரைக்கப்பட்ட பாதைகள்',
    liveUpdates: 'நேரடி புதுப்பிப்புகள்',
    
    // Bookings
    transport: 'போக்குவரத்து',
    accommodation: 'வசிப்பிடம்',
    myBookings: 'எனது முன்பதிவுகள்',
    bookNow: 'இப்போது முன்பதிவு செய்யுங்கள்',
    from: 'இருந்து',
    to: 'வரை',
    date: 'தேதி',
    time: 'நேரம்',
    passengers: 'பயணிகள்',
    
    // Complaints
    reportComplaint: 'புகாரைப் பதிவு செய்யுங்கள்',
    category: 'வகை',
    priority: 'முன்னுரிமை',
    description: 'விளக்கம்',
    location: 'இடம்',
    submit: 'சமர்ப்பிக்கவும்',
    
    // Chatbot
    askQuestion: 'கேள்வி கேளுங்கள்...',
    send: 'அனுப்பவும்',
    emergencyContacts: 'அவசர தொடர்புகள்',
    
    // Common
    loading: 'ஏற்றப்படுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    view: 'பார்',
    status: 'நிலை',
    priority: 'முன்னுரிமை',
    date: 'தேதி',
    time: 'நேரம்'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
