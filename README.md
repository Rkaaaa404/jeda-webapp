# ⚔️ SLAYER - Gamified Quest Tracker
### *Slay Your Tasks, Level Up Your Life*

---

## 🎮 The Story Behind SLAYER

Pernah nggak sih kamu merasa produktivitas itu **membosankan**? Timer countdown, to-do list yang endless, dan reward yang nggak terasa nyata? Seolah-olah kamu cuma robot yang ngerjain task tanpa ada sense of achievement yang bikin kamu excited.

Apa jadinya kalau **productivity meets RPG gaming**?

**SLAYER** lahir dari satu ide sederhana: *"Gimana kalau ngerjain tugas itu kayak main game?"*

Di dunia RPG, kamu fight monster, dapet XP, naik level, collect gold, beli item keren, dan compete di leaderboard. Kenapa produktivitas nggak bisa seseru itu?

---

## 💡 Kenapa SLAYER Beda dari Productivity App Lainnya?

SLAYER bukan sekadar timer. Ini adalah **RPG Quest Tracker** yang mengubah setiap task menjadi **epic battle** melawan monster.

### 🎯 Konsep Inti:

1. **Pilih Hero Class** - Warrior, Mage, Rogue, atau Healer (masing-masing punya bonus XP/Gold unik!)
2. **Create Quests** - Setiap task adalah quest dengan difficulty level (Easy, Medium, Hard, Epic)
3. **Battle Monsters** - Timer berubah jadi Monster HP Bar yang perlahan habis saat kamu fokus
4. **Earn Rewards** - Dapet XP & Gold berdasarkan durasi battle dan difficulty
5. **Level Up** - Unlock higher levels, collect gold, compete di leaderboard
6. **Shop System** - Beli cosmetic themes pakai gold yang kamu earn

### 🔥 Kenapa Ini Powerful?

- **Intrinsic Motivation** - Kamu nggak cuma "selesai task", tapi **"defeat monster"** dan **"level up hero"**
- **Real Progress Tracking** - Level, XP bar, gold balance - semuanya visual dan satisfying
- **Class Bonuses** - Hero class bukan cosmetic doang, ada **real gameplay impact**:
  - 🗡️ **Warrior**: +15% Gold (cocok buat grinder)
  - 🔮 **Mage**: +15% XP (fast leveling)
  - 🗡️ **Rogue**: +10% Gold, +5% XP (balanced)
  - ❤️ **Healer**: +5% Gold, +10% XP (support build)
- **Dynamic Rewards** - Semakin lama kamu battle (work session), semakin besar XP & Gold-nya
- **Evidence System** - Setelah battle, upload proof of victory untuk claim rewards dan maintain streak

---

## 🎯 Who Should Play SLAYER?

SLAYER is perfect if you:

- Are a **gamer** who wants productivity to feel like progression
- Are a **student** needing consistent momentum on assignments
- Are a **freelancer/creator** who thrives on visual progress & rewards
- Love **RPG mechanics** (classes, leveling, loot, streaks)
- Want accountability without boring to‑do lists

If traditional timers feel soulless, SLAYER turns effort into XP, Gold, Levels, and cosmetic flair.

---

## 🔥 What Makes SLAYER Addictive

### 1. Quest-Based Workflow
Every task becomes a quest with monsters, difficulty multipliers, and battle sessions.

### 2. Real Progression & Economy
You earn XP & Gold per battle. Level up faster with strategic class choice. Spend gold in the shop.

### 3. Evidence = Integrity
Claiming victory requires uploading proof. No fake grinding—only real completed work counts.

### 4. Fair & Balanced Timer Rules
- Work + Break combined must be ≥ 5 minutes
- Break cannot exceed Work duration
- Minimum battle completion threshold (minSessionDuration) prevents spam

### 5. Streak & Leaderboards
Consistency (daily evidence) fuels streak fire 🔥; skill (efficient battles) drives XP gain.

### 6. Zero Passive Waiting
Timer is a monster HP bar—visual tension drives focus.

---

## 🌟 Imagine This

- You open the dashboard: Level 9 Rogue, 1,240 Gold, streak 11 days.
- You defeat a Hard quest and instantly level up—XP bar surges, loot pops.
- You unlock a new theme and equip it; dashboard transforms visually.
- You see your name climbing the streak leaderboard—dopamine + discipline loop engaged.

SLAYER doesn’t just track time—it weaponizes it.

---

## 🚀 How to Play SLAYER

### 1️⃣ **Create Your Hero**
- Register → Pilih **Hero Class** (Warrior/Mage/Rogue/Healer)
- Setiap class punya **unique bonuses** yang affect XP & Gold earnings
- Login dan liat **Hero Stats Card** kamu di Dashboard

### 2️⃣ **Accept Quests**
- Click **"+ Create Quest"**
- Isi quest details:
  - **Title** (e.g., "Finish React Assignment")
  - **Difficulty** (Easy/Medium/Hard/Epic) → affects XP/Gold multiplier
  - **Estimated Battles** (berapa sesi mau ngerjain)
- **Random Monster** assigned automatically berdasarkan difficulty

### 3️⃣ **Battle Monsters**
- Click **"Begin Battle"** pada quest
- Timer starts → **Monster HP Bar** perlahan turun
- Fokus ngerjain task tanpa distraksi
- Options:
  - **Complete Battle** → Click "End Session" kalau udah selesai
  - **Flee** → Kabur dari battle (NO rewards, quest reset ke TODO)

### 4️⃣ **Claim Victory & Loot**
- Setelah complete minimal 1 battle, click **"Claim Victory"**
- Upload **Evidence** (screenshot/foto hasil kerja)
- Dapet **XP & Gold** based on:
  - Total battle duration
  - Quest difficulty
  - Hero class bonuses
- **Auto Level-Up** kalau XP cukup!

### 5️⃣ **Spend Your Gold**
- Buka **Shop** page
- Beli **Cosmetic Themes** pakai gold:
  - Dark Forest (100g)
  - Cyberpunk (250g)
  - Blood Moon (500g)
  - Ice Palace (750g)
  - Golden Emperor (1000g)
- Theme langsung equipped setelah purchase

### 6️⃣ **Compete & Dominate**
- Check **Leaderboard**:
  - **Top Streaks** → Siapa paling konsisten upload evidence
  - **Top Levels** → Siapa hero tertinggi
- Maintain **daily streak** dengan upload evidence setiap hari
- Climb the ranks!

---

## 🛠️ Tech Stack

**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer  
**Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons  
**Design**: RPG Dark Theme (Slate-950 + Red-600/Purple-600 gradients)  
**Game Logic**: Custom XP/Level progression, Dynamic reward calculations, Class bonus system

---

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd jeda-webapp
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Buat file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jeda
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

Seed shop items:
```bash
node seeders/seedShop.js
```
*Creates 6 cosmetic themes in database*

Jalankan server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
# App running on http://localhost:3001
```

---

## 💡 Cara Menggunakan JEDA

### Langkah Pertama
1. Buka `http://localhost:3000`
2. **Register** → Buat akun baru
3. **Login** dengan kredensial kamu

### Membuat Task
1. Di Dashboard → Klik tombol **"+ New Task"**
2. Masukkan judul task (contoh: "Belajar React Hooks")
3. Set estimasi sesi Pomodoro (default: 1, bisa lebih)
4. Klik **Add**

### Menjalankan Sesi Fokus
1. **Pilih task** yang mau dikerjakan (klik card task → highlight hijau)
2. Klik **"Start Focus"** → Timer 25 menit dimulai
3. Fokus ngerjain task tanpa distraksi
4. Klik **"End Session"** setelah selesai atau waktu habis
5. Progress task otomatis bertambah

### Menyelesaikan Task
1. Setelah task siap diselesaikan, klik ikon **✓** (hanya muncul jika status IN_PROGRESS dan sesi udah cukup)
2. Modal upload evidence muncul
3. Upload foto/screenshot hasil kerja kamu
4. Klik **"Submit Evidence"**
5. 🔥 Streak kamu naik! Task ditandai DONE

### Cek Leaderboard
1. Klik menu **Leaderboard** di sidebar
2. Lihat dua tab:
   - **Top Streaks**: User dengan streak terpanjang (konsistensi)
   - **Top Focus Time**: User dengan total sesi terbanyak
3. Filter Focus Time berdasarkan periode: Today / Week / Month / All-Time

### Lihat History
1. Klik menu **History** di sidebar
2. Semua task yang udah diselesaikan ditampilkan dengan foto evidence
3. Visual portfolio hasil kerja kamu

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register   - Create new hero account (with class selection)
POST /api/auth/login      - Login
GET  /api/auth/me         - Current user data
```

### Quests (Tasks)
```
GET    /api/tasks              - Get all user quests
POST   /api/tasks              - Create new quest
PUT    /api/tasks/:id          - Update quest (title, difficulty, estimatedSessions)
PUT    /api/tasks/:id/complete - Complete quest & claim rewards (upload evidence)
DELETE /api/tasks/:id          - Delete quest
```

### Battle Sessions
```
POST   /api/sessions/start   - Start battle session
POST   /api/sessions/stop    - End battle session
DELETE /api/sessions/:id     - Flee from battle (no rewards)
GET    /api/sessions/active  - Get active session
GET    /api/sessions         - Session history
```

### Shop
```
GET  /api/shop/items        - Get all shop items
GET  /api/shop/inventory    - Get user's owned items
POST /api/shop/purchase/:id - Purchase item with gold
PUT  /api/shop/equip/:id    - Equip purchased theme
```

### Leaderboard & Dashboard
```
GET /api/leaderboard/streak             - Top slayers by streak
GET /api/leaderboard/sessions?range=all - Top slayers by total sessions
GET /api/dashboard                      - Dashboard stats
```

---

## 📂 Project Structure

```
jeda-webapp/
├── backend/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── multer.js       # File upload config
│   ├── middleware/
│   │   └── auth.js         # JWT authentication
│   ├── models/
│   │   ├── User.js         # User schema (with RPG fields: level, XP, gold, heroClass, inventory)
│   │   ├── Task.js         # Quest schema (difficulty, monsterType, completedSessions)
│   │   ├── Session.js      # Battle session schema
│   │   └── Item.js         # Shop item schema
│   ├── routes/
│   │   ├── auth.js         # Auth endpoints (with hero class selection)
│   │   ├── tasks.js        # Quest CRUD + reward system
│   │   ├── sessions.js     # Battle sessions + flee
│   │   ├── shop.js         # Shop purchase/equip
│   │   ├── leaderboard.js  # Rankings
│   │   ├── dashboard.js    # Dashboard stats
│   │   └── settings.js     # User settings
│   ├── utils/
│   │   └── rpgLogic.js     # XP/Gold calculations, level progression, class bonuses
│   ├── seeders/
│   │   └── seedShop.js     # Seed 6 cosmetic themes
│   ├── public/uploads/     # Evidence images storage
│   ├── server.js           # Express entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar navigation (SLAYER branding)
│   │   │   ├── PrivateRoute.jsx    # Route guard
│   │   │   ├── HeroCard.jsx        # Display hero stats (level, XP bar, gold, class bonuses)
│   │   │   ├── QuestItem.jsx       # Quest card with difficulty badges, edit/delete
│   │   │   ├── BattleTimer.jsx     # Monster HP bar timer
│   │   │   ├── BreakTimer.jsx      # Break countdown
│   │   │   ├── EvidenceModal.jsx   # Upload evidence modal
│   │   │   ├── SettingsModal.jsx   # Settings modal (RPG purple theme)
│   │   │   └── Podium.jsx          # Leaderboard podium
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login/Register with hero class selection
│   │   │   ├── Dashboard.jsx       # Main quest dashboard (RPG theme)
│   │   │   ├── Shop.jsx            # Cosmetic theme shop
│   │   │   ├── Leaderboard.jsx     # Rankings (streaks & levels)
│   │   │   └── History.jsx         # Completed quests history
│   │   ├── utils/
│   │   │   └── api.js              # Axios API calls
│   │   ├── App.jsx                 # Router setup
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind CSS
│   ├── index.html                  # HTML with SLAYER title
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🧠 Core Game Logic

### XP & Level Calculation
```javascript
// From backend/utils/rpgLogic.js

function calculateLevel(currentXP) {
  let level = 1;
  let totalXPNeeded = 0;
  
  while (currentXP >= totalXPNeeded) {
    const xpForNextLevel = 100 + (level * 50);
    totalXPNeeded += xpForNextLevel;
    if (currentXP >= totalXPNeeded) level++;
    else break;
  }
  
  return { level, maxXP: 100 + (level * 50) };
}
```

### Reward Distribution
```javascript
function calculateRewards(sessionDuration, difficulty, heroClass) {
  // Base rewards per minute
  let baseXP = sessionDuration * 2;
  let baseGold = sessionDuration * 0.4;
  
  // Difficulty multipliers
  const multipliers = { Easy: 1, Medium: 1.5, Hard: 2, Epic: 3 };
  const diffMultiplier = multipliers[difficulty];
  
  // Class bonuses
  const bonuses = {
    Warrior: { xp: 0, gold: 0.15 },
    Mage: { xp: 0.15, gold: 0 },
    Rogue: { xp: 0.05, gold: 0.10 },
    Healer: { xp: 0.10, gold: 0.05 }
  };
  
  const finalXP = Math.round(baseXP * diffMultiplier * (1 + bonuses[heroClass].xp));
  const finalGold = Math.round(baseGold * diffMultiplier * (1 + bonuses[heroClass].gold));
  
  return { xp: finalXP, gold: finalGold };
}
```

### Streak Logic
```javascript
// When user uploads evidence:

IF never uploaded before:
  currentStreak = 1
  
IF already uploaded TODAY:
  no change (already counted)
  
IF last upload was YESTERDAY:
  currentStreak += 1  // Continue streak
  
IF last upload was > 1 day ago:
  currentStreak = 1   // Streak broken, reset
  
// Update longest streak if current exceeds record
longestStreak = max(currentStreak, longestStreak)
```

### Quest Lifecycle
1. User creates quest → Status: `TODO`, assign random monster
2. Click "Begin Battle" → Status: `IN_PROGRESS`, create session
3. Timer runs → Monster HP decreases
4. Options:
   - **Complete Battle** → Session saved, `completedSessions++`
   - **Flee** → Session deleted, quest reset to `TODO` (if 0 completed sessions)
5. Click "Claim Victory" → Upload evidence → Calculate total battle time → Award XP/Gold → Check level up
6. Status: `DONE`

---

## 🎨 UI/UX Highlights

- **RPG Dark Theme**: Slate-950 background with Red-600/Purple-600 gradients
- **Monster HP Bar**: Visual timer that depletes as you work
- **XP Progress Bar**: Animated gradient bar showing level progress
- **Class Bonus Display**: Shows real gameplay effects of each class
- **Difficulty Badges**: Color-coded quest difficulties (Green/Yellow/Orange/Purple)
- **Gold Currency**: Displayed with 💰 emoji, spendable in shop
- **Theme Preview**: Visual cards showing each cosmetic theme
- **Podium System**: Trophy 🏆 for top 3 leaderboard positions
- **Streak Fire Icon**: 🔥 for active streaks
- **Responsive Design**: Mobile-friendly sidebar and cards

---

## 🔐 Security

- **JWT Authentication**: Token-based with 30-day expiry
- **bcryptjs Password Hashing**: 10 salt rounds
- **Protected Routes**: Middleware auth on all private endpoints
- **File Validation**: Images only, max 5MB
- **Mongoose Schema Validation**: Input sanitization
- **Authorization Checks**: Users can only access their own data

---

## 🧪 Testing Guide

### Complete Player Journey
1. **Register** → Choose hero class (e.g., Mage for fast leveling)
2. **Login** → See Hero Card with Level 1, 0 XP, 0 Gold
3. **Create Quest** → "Complete React Tutorial" (Medium difficulty, 2 battles)
4. **Begin Battle** → Timer starts, Monster HP decreases
5. **Complete Session** (or flee to test auto-reset)
6. **Create another session** for same quest
7. **Claim Victory** → Upload screenshot → See reward notification
8. **Check Hero Card** → XP increased, maybe leveled up, gold earned
9. **Visit Shop** → Browse themes, purchase with gold
10. **Check Leaderboard** → See your ranking
11. **Test Streak** → Upload evidence daily to maintain streak

### Example Quests for Testing
- "Learn Tailwind CSS" (Easy, 1 battle)
- "Build Authentication System" (Medium, 2 battles)
- "Implement RPG Game Logic" (Hard, 3 battles)
- "Deploy Production App" (Epic, 5 battles)

---

## 🆘 Troubleshooting

### Backend won't start
- Ensure MongoDB is running (`mongod` command or MongoDB service)
- Check `.env` file exists with correct `MONGODB_URI`
- Verify port 5000 is not being used by another process

### Frontend can't connect to backend
- Check backend is running on port 5000
- Verify `vite.config.js` proxy is set to `http://localhost:5000`
- Clear browser cache and restart dev server

### Shop items not showing
- Run shop seeder: `node seeders/seedShop.js` from backend folder
- Check MongoDB connection and database name

### Level not updating after quest completion
- Page auto-reloads after 2 seconds on level-up
- If stuck, manually refresh page
- Check browser console for errors

### Timer resets when switching tabs
- This should be fixed (timestamp-based timer)
- Clear browser cache if issue persists
- Check browser console for session errors