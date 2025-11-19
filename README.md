# JEDA - Fullstack Productivity Ecosystem

**A distraction-free productivity web application where users plan tasks, execute focus sessions (Pomodoro), and MUST upload visual evidence to validate their work.**

Built with the MERN stack, featuring gamification (streaks) and social competition (leaderboards).

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API Server
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** + **bcryptjs** - Authentication
- **Multer** - File Upload (Evidence Images)

### Frontend
- **React 18** + **Vite** - Fast Development
- **Tailwind CSS** - Dark Mode UI (Slate-950 + Emerald-500)
- **React Router** - Navigation
- **Lucide React** - Icons
- **Axios** - API Client

---

## 🎯 Core Features

### 1. Task-Based Workflow
1. **Plan** - Create tasks with estimated sessions
2. **Focus** - Select task → Start 25-min timer
3. **Log** - Timer ends → Session saved → Progress updated
4. **Complete** - Mark task DONE → Upload evidence photo
5. **Validate** - Evidence uploaded → Streak updated ✨

### 2. Gamification
- **Streak System**
  - 🔥 **Active**: Evidence uploaded today
  - ⚪ **Pending**: Active today but no evidence yet
  - **Reset**: Missed yesterday = streak reset to 0
- **Leaderboards**
  - Top Streaks (by current streak)
  - Top Grinders (by sessions: Today/Week/Month/All-Time)

### 3. IoT Ready
- Sessions can be triggered via Web or IoT devices (future)
- `source` field in Session model: `WEB` | `IOT`

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local or Atlas)
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd vibe-coding
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure Environment Variables**  
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jeda
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

**Start MongoDB** (if using local instance):
```bash
# Windows (if installed as service)
net start MongoDB

# Or using mongod directly
mongod --dbpath C:\data\db
```

**Run Backend Server**:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

---

## 🚀 Usage Guide

### First Time Setup
1. Navigate to `http://localhost:3000`
2. Click **Register** → Create account
3. Login with credentials

### Creating Tasks
1. Dashboard → Click **"+ New Task"**
2. Enter title (e.g., "Build Login Feature")
3. Set estimated sessions (default: 1)
4. Click **Add**

### Focus Sessions
1. Click a task to **select** it (highlights in green)
2. Click **"Start Focus"** → 25-minute timer begins
3. Work on the task
4. Click **"End Session"** when done
5. Task progress updates automatically

### Completing Tasks
1. When ready to finish a task, click the **✓ icon** (IN_PROGRESS tasks only)
2. **Evidence Modal** appears
3. Upload a photo of your work (screenshot, photo, etc.)
4. Click **"Submit Evidence"**
5. 🔥 Streak updated! Task marked DONE

### Checking Leaderboard
1. Navigate to **Leaderboard** page
2. Switch tabs:
   - **Top Streaks** - Users with longest current streaks
   - **Top Grinders** - Most sessions completed
3. Filter Grinders by: Today / Week / Month / All-Time

### Viewing History
1. Navigate to **History** page
2. See all completed tasks with evidence images
3. Visual grid view of your validated work

---

## 🔌 API Reference

### Authentication
```
POST /api/auth/register   - Create new account
POST /api/auth/login      - Login
GET  /api/auth/me         - Get current user
```

### Tasks
```
GET    /api/tasks              - Get all user tasks
POST   /api/tasks              - Create task
PUT    /api/tasks/:id          - Update task
PUT    /api/tasks/:id/complete - Complete task (with evidence upload)
DELETE /api/tasks/:id          - Delete task
```

### Sessions (Timer)
```
POST /api/sessions/start   - Start focus session
POST /api/sessions/stop    - Stop active session
GET  /api/sessions/active  - Get current active session
GET  /api/sessions         - Get session history
```

### Leaderboard
```
GET /api/leaderboard/streak             - Top users by streak
GET /api/leaderboard/sessions?range=all - Top users by sessions
```

### Dashboard
```
GET /api/dashboard - Get user stats, active task, today's progress
```

---

## 📂 Project Structure

```
vibe-coding/
├── backend/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── multer.js       # File upload config
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── User.js         # User schema (with stats)
│   │   ├── Task.js         # Task schema
│   │   └── Session.js      # Session schema
│   ├── routes/
│   │   ├── auth.js         # Auth endpoints
│   │   ├── tasks.js        # Task CRUD + evidence
│   │   ├── sessions.js     # Timer start/stop
│   │   ├── leaderboard.js  # Aggregation queries
│   │   └── dashboard.js    # Dashboard data
│   ├── public/uploads/     # Evidence images storage
│   ├── server.js           # Express app entry
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar navigation
│   │   │   ├── PrivateRoute.jsx    # Auth guard
│   │   │   ├── TimerDisplay.jsx    # Circular timer
│   │   │   ├── TaskItem.jsx        # Task card
│   │   │   ├── EvidenceModal.jsx   # Upload modal
│   │   │   └── Podium.jsx          # Leaderboard podium
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Auth page
│   │   │   ├── Dashboard.jsx       # Main app (timer + tasks)
│   │   │   ├── Leaderboard.jsx     # Rankings
│   │   │   └── History.jsx         # Completed tasks
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance + API calls
│   │   ├── App.jsx                 # Router setup
│   │   ├── main.jsx                # React entry
│   │   └── index.css               # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🧠 Business Logic Details

### Streak Calculation Algorithm
```javascript
// In backend/routes/tasks.js - updateStreak()

IF user has NO previous evidence:
  currentStreak = 1
  
ELSE IF lastEvidenceDate == TODAY:
  // No change (already uploaded today)
  
ELSE IF lastEvidenceDate == YESTERDAY:
  currentStreak += 1  // Consecutive day
  
ELSE:
  currentStreak = 1   // Streak broken, restart
  
// Always update longestStreak if current > longest
longestStreak = max(currentStreak, longestStreak)
```

### Session Flow
1. User selects Task → Task status becomes `IN_PROGRESS`
2. Start Timer → Create `Session` with `status: ONGOING`
3. Stop Timer → Update `Session.endTime`, calculate `duration`
4. Increment `Task.completedSessions`
5. Increment `User.stats.totalSessions`

### Evidence Requirement
- Tasks can only be marked `DONE` with evidence upload
- Evidence is a required file in the complete endpoint
- Uploads stored in `backend/public/uploads/`
- URL saved in `Task.evidenceImage`

---

## 🎨 UI/UX Highlights

- **Dark Mode Only** - Slate-950 background
- **Emerald Accents** - Primary color (#10b981)
- **Circular Timer** - Visual progress indicator
- **Streak Icons**
  - 🔥 Fire (Active streak)
  - ⚪ Circle (Pending/Inactive)
- **Podium Display** - 🏆 Trophy for top 3 users
- **Responsive Design** - Mobile-friendly sidebar

---

## 🔐 Security Features

- **JWT Authentication** - Token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Protected Routes** - Auth middleware on all private endpoints
- **File Validation** - Image-only uploads, 5MB limit
- **Input Sanitization** - Mongoose schema validation

---

## 🧪 Testing the App

### Test User Journey
1. **Register** a new account
2. **Create** 2-3 tasks
3. **Select** a task and **start** timer
4. Wait or **stop** immediately (for testing)
5. Observe task progress increment
6. **Complete** a task → Upload any image
7. Check **streak icon** changes to 🔥
8. View **Leaderboard** → See yourself ranked
9. Go to **History** → See completed task with image

### Sample Tasks to Create
- "Build Authentication System" (2 sessions)
- "Design Dashboard UI" (3 sessions)
- "Write API Documentation" (1 session)

---

## 🚧 Future Enhancements (Not in MVP)

- IoT device integration (ESP32/Arduino triggers)
- Real-time notifications (Socket.io)
- Team/group productivity tracking
- Advanced analytics (charts, trends)
- Task categories/tags
- Custom timer durations
- Sound notifications
- Dark/Light mode toggle

---

## 📝 Development Notes

### MongoDB Collections
- `users` - User accounts and stats
- `tasks` - User tasks with evidence
- `sessions` - Focus session records

### Key Dependencies
**Backend:**
- `express@^4.18.2`
- `mongoose@^8.0.0`
- `bcryptjs@^2.4.3`
- `jsonwebtoken@^9.0.2`
- `multer@^1.4.5`

**Frontend:**
- `react@^18.2.0`
- `react-router-dom@^6.20.0`
- `axios@^1.6.2`
- `lucide-react@^0.294.0`
- `tailwindcss@^3.3.6`

---

## 🤝 Contributing

This is a MVP phase project. Core features are complete. For enhancements:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create Pull Request

---

## 📄 License

MIT License - Feel free to use for learning/personal projects.

---

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with correct values
- Run `npm install` in backend directory

### Frontend won't connect to API
- Ensure backend is running on port 5000
- Check Vite proxy config in `vite.config.js`
- Verify CORS is enabled in `server.js`

### Image upload fails
- Check `backend/public/uploads/` directory exists
- Verify file size < 5MB
- Ensure file is an image type (jpg/png/gif/webp)

### Streak not updating
- Ensure task is marked `IN_PROGRESS` before completing
- Verify evidence image is uploaded successfully
- Check backend logs for errors

---

**Built with ❤️ for the productivity-obsessed**
