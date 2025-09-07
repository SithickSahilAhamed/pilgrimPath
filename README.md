# PilgrimPath - Smart Crowd Management System

A comprehensive end-to-end web application for managing large crowd events like Simhastha Mahakumbh, featuring real-time crowd monitoring, multilingual support, and intelligent incident management.

## 🚀 Features

### User-Facing Features
- **Mobile-friendly Home Screen** with search functionality and live event alerts
- **Real-time Interactive Map** with color-coded crowd density visualization (green/yellow/red)
- **Multilingual Chatbot** supporting Hindi, Tamil, and English for pilgrim queries and emergency help
- **Booking System** for shuttle/e-rickshaw rides and room/homestay accommodations
- **Complaint Reporting** with location tagging and media upload support
- **Push Notifications** for crowd alerts and emergencies

### Admin Dashboard Features
- **Live Metrics Dashboard** with real-time updates on incidents, response times, and critical alerts
- **Sector-wise Monitoring** with asset status tracking (sanitation, water, medical, transport)
- **Incident Management** with task assignment, status tracking, and resolution history
- **Analytics & Reports** comparing AI vs manual response times and resolution rates
- **Health & Hygiene Dashboard** with disease outbreak monitoring and public health scoring
- **Exportable Reports** in CSV/PDF formats

## 🛠 Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Maps**: Google Maps API / Mapbox integration
- **Real-time**: Socket.io for live updates
- **Authentication**: JWT-based auth system
- **Multilingual**: i18next for language support

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pilgrimpath
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/pilgrimpath
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000
   PORT=5000
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🗂 Project Structure

```
pilgrimpath/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── ...
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── ...
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Incidents
- `GET /api/incidents` - Get all incidents with filters
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id/status` - Update incident status
- `POST /api/incidents/:id/notes` - Add note to incident

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/status` - Update booking status

### Rooms
- `GET /api/rooms` - Get available rooms with filters
- `POST /api/rooms` - Create room listing
- `POST /api/rooms/:id/reviews` - Add room review

### Analytics & Health
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/health/dashboard` - Get health dashboard data
- `GET /api/notifications` - Get user notifications

## 🌐 Multilingual Support

The application supports three languages:
- **English** (en) - Default
- **Hindi** (hi) - हिन्दी
- **Tamil** (ta) - தமிழ்

Language can be changed via the language selector in the navigation bar.

## 📱 Mobile-First Design

The application is built with a mobile-first approach, ensuring optimal experience across all devices:
- Responsive design using Tailwind CSS
- Touch-friendly interface elements
- Optimized for small screens
- Progressive Web App (PWA) capabilities

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Helmet.js for security headers

## 📊 Demo Data

The application includes comprehensive demo data for testing:
- Sample users with different roles
- Mock incident reports
- Room listings and bookings
- Health metrics and alerts
- Analytics data

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `GOOGLE_MAPS_API_KEY`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- AI-powered crowd prediction
- Advanced analytics with machine learning
- Mobile app development
- Integration with IoT sensors
- Advanced reporting and visualization
- Multi-event support

---

**PilgrimPath** - Making large events safer and more manageable through technology.
