# SQL-it: Interactive SQL Learning Platform

A modern, fully-featured frontend web application for learning SQL through interactive lessons, hands-on practice, and gamified features.

## 🚀 Features

### Core Features
- ✅ **Authentication System**: Sign in/Sign up with client-side validation
- ✅ **Interactive Lessons**: Structured SQL learning path with difficulty levels
- ✅ **SQL Practice Editor**: Write and execute SQL queries in real-time
- ✅ **Quiz System**: Test knowledge with interactive quizzes
- ✅ **Leaderboard**: Competitive ranking system with scoring
- ✅ **User Profile**: Track progress, achievements, and statistics
- ✅ **Dark Mode**: Professional theme toggle with smooth transitions

### Technical Implementation

#### ✅ JS Validation & DOM Manipulation
- Form validation using custom validation utilities (`src/utils/validation.ts`)
- Real-time DOM updates via React state management
- Input sanitization to prevent XSS attacks
- Dynamic UI updates based on user interactions

#### ✅ REST API with JSON Server
- Mock REST API using `db.json` for development
- Fetch API implementation (`src/utils/api.ts`)
- CRUD operations for users, lessons, quizzes, and leaderboard
- Simulated async operations with proper error handling

#### ✅ Fetch API / Ajax (XHR)
- Modern Fetch API usage throughout the application
- Async/await patterns for clean code
- Error handling and loading states
- Response validation and data transformation

#### ✅ GraphQL Implementation
- Complete GraphQL schema definition (`src/utils/graphql.ts`)
- Query examples for data retrieval
- Mutation examples for data modification
- Subscription examples for real-time updates
- Input validation and execution logic

### 🎨 Design System

#### Color Palette
- **Primary**: Vibrant cyan (#00B8D4) - Main brand color
- **Secondary**: Purple (#9C27B0) - Accent color
- **Success**: Green (#4CAF50) - Correct answers & achievements
- **Warning**: Orange (#FF9800) - Hints & alerts
- **Destructive**: Red (#F44336) - Errors

#### Features
- Semantic CSS tokens (no hardcoded colors)
- HSL color system for consistency
- Gradient backgrounds and effects
- Smooth animations and transitions
- Responsive design for all devices
- Professional glassmorphism effects

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation with theme toggle
│   └── ThemeToggle.tsx # Dark mode toggle
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx# Theme management
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page
│   ├── SignIn.tsx      # Login page
│   ├── SignUp.tsx      # Registration page
│   ├── Dashboard.tsx   # User dashboard
│   ├── Lessons.tsx     # SQL lessons list
│   ├── Practice.tsx    # SQL editor
│   ├── Leaderboard.tsx # Rankings
│   └── Profile.tsx     # User profile
├── utils/              # Utility functions
│   ├── api.ts          # REST API calls
│   ├── graphql.ts      # GraphQL implementation
│   └── validation.ts   # Form validation
└── index.css           # Design system tokens
```

## 🛠️ Setup & Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **(Optional) Start JSON Server** for REST API mock:
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

## 🧪 Testing the Features

### Authentication
1. Go to Sign Up page
2. Create account with email/password (validated)
3. Sign in with credentials
4. Session persists in localStorage

### Lessons
1. Navigate to Lessons page
2. Click "Start Lesson" on any lesson
3. Complete lesson to earn 100 XP
4. Progress tracked automatically

### SQL Practice
1. Go to Practice page
2. Write SQL queries in the editor
3. Click "Execute Query" to see results
4. Try sample queries provided

### Leaderboard
1. Visit Leaderboard page
2. See ranked users by score
3. Your position highlighted
4. Updates after completing lessons

### Dark Mode
1. Click theme toggle in navbar
2. Smooth transition between themes
3. Preference saved in localStorage
4. Works across all pages

## 🔐 Security Features

- ✅ Input sanitization (XSS prevention)
- ✅ Email format validation
- ✅ Password length requirements
- ✅ SQL query length limits
- ✅ No sensitive data in console logs
- ✅ Proper encoding for external APIs

## 📊 SEO Optimization

- ✅ Semantic HTML5 structure
- ✅ Meta tags for social sharing
- ✅ Descriptive title and description
- ✅ Canonical URLs
- ✅ Structured headings (H1, H2, H3)
- ✅ Alt text for images (if added)
- ✅ Mobile-responsive design
- ✅ Fast loading times

## 🎓 GraphQL Features

The application includes a complete GraphQL implementation demonstrating:

1. **Schema Definition**: Type definitions for User, Lesson, Query, etc.
2. **Queries**: Fetch users, lessons, leaderboard, execute SQL
3. **Mutations**: Create/update users, complete lessons
4. **Subscriptions**: Real-time leaderboard and score updates
5. **Validation**: Input validation for all operations
6. **Execution**: Mock execution layer for testing

See `src/utils/graphql.ts` for implementation details.

## 🌐 REST API Endpoints (Mock)

The application simulates the following REST API endpoints:

- `GET /api/lessons` - Fetch all lessons
- `GET /api/quizzes` - Fetch quizzes
- `GET /api/leaderboard` - Fetch rankings
- `POST /api/query` - Execute SQL query
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user

## 🎯 Future Enhancements

- Add quiz functionality with instant feedback
- Implement real-time collaborative features
- Add code highlighting in SQL editor
- Create achievement badges system
- Add lesson progress tracking
- Implement streak system
- Add social sharing features

## 📝 Notes

- This is a **frontend-only** application as specified
- Data persists in localStorage
- JSON Server can be used for development
- All validations are client-side
- Authentication is simulated (no backend required)

## 🤝 Contributing

This is a learning platform built with modern web technologies. Contributions are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.
