# Findora - AI-Powered Smart Lost & Found Ecosystem

![Findora Banner](https://placehold.co/1200x300/3b82f6/ffffff?text=Findora+Smart+Lost+%26+Found)

A professional, production-ready web platform that revolutionizes lost-and-found systems using **AI matching**, **smart lockers**, and **secure communication**.

## 🌟 Features

### Core Functionality
- **📱 Report Lost/Found Items** - Easy-to-use forms with image upload and detailed descriptions
- **🤖 AI-Powered Matching** - Intelligent matching algorithm with confidence scores and explainable reasoning
- **🔒 Smart Locker Integration** - ESP32-based secure contactless item return with OTP verification
- **💬 Secure In-App Chat** - Private messaging for direct handovers
- **🏆 Rewards System** - Points and badges for helpful contributions
- **📊 Admin Dashboard** - Analytics, user management, and system monitoring

### AI Matching Engine
The system uses a sophisticated matching algorithm that considers:
- **Image Similarity** (30%) - Visual comparison of items
- **Text Similarity** (20%) - NLP-based description matching
- **Category Match** (10%) - Exact category alignment
- **Brand/Model** (15%) - Product identification
- **Color Match** (5%) - Visual attributes
- **Location Proximity** (10%) - Geographic closeness
- **Time Window** (10%) - Temporal relevance

Each match includes:
- ✅ Confidence score (0-100%)
- ✅ Detailed reasoning with factor breakdown
- ✅ Side-by-side comparison view
- ✅ User verification workflow

### Smart Locker Workflow
1. **Assignment** - System assigns available locker
2. **Deposit** - Finder places item and confirms
3. **OTP Generation** - Secure 6-digit code sent to owner
4. **Verification** - Owner enters OTP to unlock
5. **Collection** - Auto-complete upon retrieval

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FINDORA PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Backend    │  │   Database   │      │
│  │ React + Vite │◄─┤   Node.js    │◄─┤  Firestore   │      │
│  │  Tailwind    │  │   Express    │  │  (Demo Mode) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                   │             │
│         │                  │                   │             │
│  ┌──────▼──────────────────▼───────────────────▼────┐       │
│  │           AI Matching Engine                      │       │
│  │  • Image Similarity  • Text Analysis             │       │
│  │  • Location Scoring  • Time Windows              │       │
│  └───────────────────────────────────────────────────┘       │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Smart Locker System                   │     │
│  │  ESP32 + WiFi + Solenoid + OLED + OTP Security   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Smart-Lock-Found-Ecosystem

# Install backend dependencies
cd findora-backend
npm install
cp .env.example .env

# Install frontend dependencies
cd ../findora-frontend
npm install
cp .env.example .env
```

### Running in Demo Mode (No Firebase Required)

The platform runs in **demo mode** by default with in-memory data storage.

```bash
# Terminal 1 - Backend
cd findora-backend
npm start
# Backend runs on http://localhost:3001

# Terminal 2 - Frontend
cd findora-frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Platform

1. Open http://localhost:5173
2. Click any demo user to login:
   - **Alice Johnson** (User) - Regular user with existing reports
   - **Bob Smith** (User) - Regular user
   - **Admin User** (Institution Admin) - Full admin access
   - **Officer Singh** (Police) - Law enforcement access
   - **Super Admin** (Super Admin) - System administrator

## 📁 Project Structure

```
Smart-Lock-Found-Ecosystem/
├── findora-backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebase.js         # Firebase/Demo mode config
│   │   │   └── demoStore.js        # In-memory demo database
│   │   ├── middleware/
│   │   │   └── auth.js             # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js             # Authentication routes
│   │   │   ├── reports.js          # Report CRUD
│   │   │   ├── matches.js          # AI matching
│   │   │   ├── lockers.js          # Smart locker API
│   │   │   ├── chat.js             # Messaging
│   │   │   ├── notifications.js    # Notifications
│   │   │   └── admin.js            # Admin panel
│   │   ├── services/
│   │   │   ├── aiMatcher.js        # AI matching engine
│   │   │   └── otpService.js       # OTP generation/validation
│   │   └── index.js                # Express server
│   ├── package.json
│   └── .env.example
│
└── findora-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                 # Reusable UI components
    │   │   └── NotificationBell.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state management
    │   ├── lib/
    │   │   ├── api.js              # Axios API client
    │   │   ├── firebase.js         # Firebase config
    │   │   └── utils.js            # Helper functions
    │   ├── pages/
    │   │   ├── auth/               # Login pages
    │   │   ├── dashboard/          # User dashboard
    │   │   └── admin/              # Admin panel
    │   ├── App.jsx                 # Routing
    │   └── main.jsx                # Entry point
    ├── package.json
    └── .env.example
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DEMO_MODE=true

# Firebase (optional - only for production)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="..."
# ... other Firebase credentials

# OTP Settings
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_DEMO_MODE=true

# Firebase (optional - only for production)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# ... other Firebase config
```

## 🎯 User Flows

### Lost Item Flow
1. User reports lost item with details and photo
2. AI analyzes existing found reports
3. System generates potential matches
4. User receives notification of matches
5. User reviews and accepts/rejects matches
6. User verifies ownership
7. Choose return method (direct chat or locker)
8. Complete recovery

### Found Item Flow
1. User reports found item with details and photo
2. AI analyzes existing lost reports
3. System generates potential matches
4. System notifies potential owners
5. Owner claims and verifies
6. Finder gets notified of verified match
7. Arrange return via chosen method
8. Earn reward points upon completion

### Smart Locker Flow
1. Match is verified by owner
2. Owner selects "Smart Locker" return method
3. System assigns available locker
4. Finder deposits item and confirms
5. System generates OTP and sends to owner
6. Owner enters OTP at locker
7. Locker unlocks automatically
8. Owner collects item
9. System marks case as completed

## 🔐 Security Features

- **Role-Based Access Control** (User, Admin, Police, Super Admin)
- **JWT-style Token Authentication** (Demo mode uses prefixed tokens)
- **OTP Expiry** (10 minutes default)
- **Rate Limiting** (Max 5 OTP attempts, 15-min lockout)
- **Input Validation** (Express-validator)
- **CORS Protection**
- **Helmet.js Security Headers**
- **Audit Logging** (All critical actions logged)
- **Anonymous Reporting** (Optional privacy mode)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/demo-login` - Demo mode login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Reports
- `GET /api/reports` - List reports (with filters)
- `POST /api/reports` - Create report (triggers AI matching)
- `GET /api/reports/:id` - Get report details
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Matches
- `GET /api/matches` - List matches for user
- `GET /api/matches/:id` - Get match details with reasoning
- `POST /api/matches/:id/accept` - Accept match
- `POST /api/matches/:id/reject` - Reject match
- `POST /api/matches/:id/verify` - Verify ownership
- `POST /api/matches/:id/complete` - Mark completed

### Smart Lockers
- `GET /api/lockers` - List all lockers
- `POST /api/lockers/assign` - Assign locker to match
- `POST /api/lockers/sessions/:id/deposit` - Mark item deposited
- `POST /api/lockers/sessions/:id/verify-otp` - Verify OTP and unlock
- `POST /api/lockers/sessions/:id/resend-otp` - Resend OTP

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/analytics/categories` - Category breakdown
- `GET /api/admin/leaderboard` - Top contributors

## 🏅 Rewards System

Users earn points for:
- **Report Found Item**: +50 points
- **Report Lost Item**: +10 points
- **Verified Return**: +100 points (finder)
- **Item Recovered**: +25 points (owner)

Badges earned for achievements:
- `newcomer` - First registered user
- `early_adopter` - Early platform user
- `good_samaritan` - Multiple verified returns
- `first_report` - Created first report

## 🔌 ESP32 Smart Locker

### Hardware Requirements
- ESP32 DevKit
- 12V Solenoid Lock
- OLED Display (SSD1306)
- Relay Module
- Buzzer
- LED indicators
- Door sensor (optional)

### Software Simulation
The platform includes a **software simulation mode** for testing the complete locker workflow without hardware.

Locker states:
- `AVAILABLE` - Ready for assignment
- `RESERVED` - Assigned to a match
- `ITEM_DEPOSITED` - Item placed by finder
- `READY_FOR_COLLECTION` - OTP sent to owner
- `OPEN` - Locker unlocked
- `COLLECTED` - Item retrieved
- `OFFLINE` - Not responding
- `ERROR` - System error

## 🚢 Production Deployment

### Firebase Setup (Optional)

1. Create Firebase project
2. Enable Firestore, Authentication, and Storage
3. Download service account key
4. Update backend `.env` with credentials
5. Set `DEMO_MODE=false`
6. Update frontend `.env` with Firebase config

### Build for Production

```bash
# Backend
cd findora-backend
npm start

# Frontend
cd findora-frontend
npm run build
# Deploy dist/ folder to hosting service
```

## 🧪 Testing

The platform includes demo data for testing:
- 5 pre-existing reports (lost and found)
- 1 high-confidence match (91%)
- Multiple locker statuses
- Sample notifications and chats

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Recharts for data visualization
- Lucide React for icons
- Tailwind CSS for styling
- OpenAI for AI inspiration

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for making the world a better place, one found item at a time.**
