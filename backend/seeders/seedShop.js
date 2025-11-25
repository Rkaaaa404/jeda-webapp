import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../models/Item.js';

dotenv.config();

const shopItems = [
  {
    name: 'Default Theme',
    cost: 0,
    type: 'theme',
    themeId: 'default',
    description: 'The classic Slayer theme'
  },
  {
    name: 'Dark Forest Theme',
    cost: 100,
    type: 'theme',
    themeId: 'dark-forest',
    description: 'Deep greens and earthy tones for nature lovers'
  },
  {
    name: 'Cyberpunk Theme',
    cost: 250,
    type: 'theme',
    themeId: 'cyberpunk',
    description: 'Neon lights and futuristic vibes'
  },
  {
    name: 'Blood Moon Theme',
    cost: 500,
    type: 'theme',
    themeId: 'blood-moon',
    description: 'Dark crimson aesthetic for serious slayers'
  },
  {
    name: 'Ice Palace Theme',
    cost: 750,
    type: 'theme',
    themeId: 'ice-palace',
    description: 'Cool blues and frozen elegance'
  },
  {
    name: 'Golden Emperor Theme',
    cost: 1000,
    type: 'theme',
    themeId: 'golden-emperor',
    description: 'Luxurious gold for legendary heroes'
  }
];

const seedShop = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing shop items');

    // Insert new items
    await Item.insertMany(shopItems);
    console.log('🛒 Shop items seeded successfully!');

    console.log('\n📦 Available Items:');
    shopItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - ${item.cost}g`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding shop:', error);
    process.exit(1);
  }
};

seedShop();
