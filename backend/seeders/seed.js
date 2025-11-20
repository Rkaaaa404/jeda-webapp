import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Session from '../models/Session.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-coding');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Session.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Define users with varying stats
    const users = [
      {
        username: 'alice_wonder',
        password: hashedPassword,
        stats: {
          currentStreak: 15,
          longestStreak: 20,
          lastEvidenceDate: new Date(),
          dailyGoal: 4,
          totalSessions: 120,
          mostSessionsInDay: 8
        },
        settings: {
          workDuration: 25,
          shortBreak: 5,
          minSessionDuration: 5
        }
      },
      {
        username: 'bob_builder',
        password: hashedPassword,
        stats: {
          currentStreak: 7,
          longestStreak: 12,
          lastEvidenceDate: new Date(),
          dailyGoal: 3,
          totalSessions: 65,
          mostSessionsInDay: 6
        },
        settings: {
          workDuration: 30,
          shortBreak: 5,
          minSessionDuration: 10
        }
      },
      {
        username: 'charlie_code',
        password: hashedPassword,
        stats: {
          currentStreak: 3,
          longestStreak: 8,
          lastEvidenceDate: new Date(),
          dailyGoal: 5,
          totalSessions: 42,
          mostSessionsInDay: 7
        },
        settings: {
          workDuration: 25,
          shortBreak: 5,
          minSessionDuration: 5
        }
      },
      {
        username: 'diana_dev',
        password: hashedPassword,
        stats: {
          currentStreak: 1,
          longestStreak: 5,
          lastEvidenceDate: new Date(),
          dailyGoal: 4,
          totalSessions: 28,
          mostSessionsInDay: 5
        },
        settings: {
          workDuration: 25,
          shortBreak: 5,
          minSessionDuration: 5
        }
      },
      {
        username: 'evan_engineer',
        password: hashedPassword,
        stats: {
          currentStreak: 0,
          longestStreak: 3,
          lastEvidenceDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          dailyGoal: 3,
          totalSessions: 15,
          mostSessionsInDay: 4
        },
        settings: {
          workDuration: 25,
          shortBreak: 5,
          minSessionDuration: 5
        }
      }
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create tasks for each user
    const tasksData = [];
    const sessionsData = [];

    for (const user of createdUsers) {
      const numTasks = Math.floor(Math.random() * 3) + 3; // 3-5 tasks per user
      
      for (let i = 0; i < numTasks; i++) {
        const taskStatus = i === 0 ? 'TODO' : i === 1 ? 'IN_PROGRESS' : 'DONE';
        const estimatedSessions = Math.floor(Math.random() * 3) + 2; // 2-4 sessions
        const completedSessions = taskStatus === 'DONE' ? estimatedSessions : taskStatus === 'IN_PROGRESS' ? Math.floor(estimatedSessions / 2) : 0;

        tasksData.push({
          userId: user._id,
          title: `${taskStatus === 'DONE' ? 'Completed' : taskStatus === 'IN_PROGRESS' ? 'Working on' : 'Plan to'} Task ${i + 1} for ${user.username}`,
          status: taskStatus,
          estimatedSessions,
          completedSessions,
          evidenceImage: taskStatus === 'DONE' ? '/uploads/evidence-placeholder.jpg' : null,
          completedAt: taskStatus === 'DONE' ? new Date() : null
        });
      }

      // Create historical sessions for the past 7 days
      const sessionsPerDay = user.stats.totalSessions / 7;
      for (let day = 0; day < 7; day++) {
        const numSessionsThisDay = Math.floor(Math.random() * 3) + Math.floor(sessionsPerDay);
        
        for (let s = 0; s < numSessionsThisDay; s++) {
          const sessionDate = new Date();
          sessionDate.setDate(sessionDate.getDate() - day);
          sessionDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);

          const duration = 20 + Math.floor(Math.random() * 15); // 20-35 minutes

          sessionsData.push({
            userId: user._id,
            taskId: null, // Free focus session for simplicity
            startTime: sessionDate,
            endTime: new Date(sessionDate.getTime() + duration * 60 * 1000),
            duration,
            status: 'COMPLETED'
          });
        }
      }
    }

    // Insert tasks and sessions
    const createdTasks = await Task.insertMany(tasksData);
    console.log(`✅ Created ${createdTasks.length} tasks`);

    const createdSessions = await Session.insertMany(sessionsData);
    console.log(`✅ Created ${createdSessions.length} sessions`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Test accounts (all with password: password123):');
    createdUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} - Streak: ${user.stats.currentStreak} days, Sessions: ${user.stats.totalSessions}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => seedDatabase());
