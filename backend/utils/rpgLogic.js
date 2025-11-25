// RPG Game Logic Utilities

/**
 * Difficulty Multipliers for XP and Gold Rewards
 */
export const DIFFICULTY_MULTIPLIERS = {
  Easy: { xp: 1, gold: 10 },
  Medium: { xp: 1.5, gold: 20 },
  Hard: { xp: 2.5, gold: 40 },
  Epic: { xp: 4, gold: 80 }
};

/**
 * Base Rewards per Session
 */
export const BASE_REWARDS = {
  xp: 50,
  gold: 10
};

/**
 * Hero Class Bonuses
 */
export const CLASS_BONUSES = {
  Warrior: { xp: 1.0, gold: 1.15 },  // +15% Gold
  Mage: { xp: 1.15, gold: 1.0 },     // +15% XP
  Rogue: { xp: 1.05, gold: 1.1 },    // +5% XP, +10% Gold (Balanced)
  Healer: { xp: 1.1, gold: 1.05 }    // +10% XP, +5% Gold (Support)
};

/**
 * Calculate XP/Gold rewards based on session duration, difficulty, and hero class
 * @param {Number} sessionDuration - Session duration in minutes
 * @param {String} difficulty - Quest difficulty (Easy, Medium, Hard, Epic)
 * @param {String} heroClass - Hero class (Warrior, Mage, Rogue, Healer)
 * @returns {Object} - { xp, gold }
 */
export const calculateRewards = (sessionDuration = 25, difficulty = 'Medium', heroClass = 'Warrior') => {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || DIFFICULTY_MULTIPLIERS.Medium;
  const classBonus = CLASS_BONUSES[heroClass] || CLASS_BONUSES.Warrior;
  
  // Base rewards scale with session duration (1 minute = 2 XP, 0.4 Gold)
  const baseXP = sessionDuration * 2;
  const baseGold = sessionDuration * 0.4;
  
  return {
    xp: Math.floor(baseXP * multiplier.xp * classBonus.xp),
    gold: Math.floor((baseGold + multiplier.gold) * classBonus.gold)
  };
};

/**
 * Calculate XP needed for next level (exponential scaling)
 * @param {Number} level - Current level
 * @returns {Number} - XP needed for next level
 */
export const calculateMaxXP = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Process level up and return new stats
 * @param {Object} user - User document
 * @returns {Object} - { leveledUp, newLevel, stats }
 */
export const processLevelUp = (user) => {
  let leveledUp = false;
  let levelsGained = 0;

  // Check for multiple level ups
  while (user.currentXP >= user.maxXP) {
    user.currentXP -= user.maxXP;
    user.level += 1;
    user.maxXP = calculateMaxXP(user.level);
    leveledUp = true;
    levelsGained += 1;
  }

  return {
    leveledUp,
    levelsGained,
    newLevel: user.level,
    stats: {
      level: user.level,
      currentXP: user.currentXP,
      maxXP: user.maxXP,
      gold: user.gold
    }
  };
};

/**
 * Award rewards to user and process level ups
 * @param {Object} user - User document
 * @param {Number} sessionDuration - Session duration in minutes
 * @param {String} difficulty - Quest difficulty
 * @returns {Object} - Updated user stats and reward info
 */
export const awardRewards = async (user, sessionDuration, difficulty) => {
  const rewards = calculateRewards(sessionDuration, difficulty, user.heroClass);
  
  // Add rewards
  user.currentXP += rewards.xp;
  user.gold += rewards.gold;

  // Process level ups
  const levelUpResult = processLevelUp(user);

  await user.save();

  return {
    rewards,
    ...levelUpResult,
    currentStats: {
      level: user.level,
      currentXP: user.currentXP,
      maxXP: user.maxXP,
      gold: user.gold
    }
  };
};

/**
 * Get random monster type based on difficulty
 * @param {String} difficulty
 * @returns {String}
 */
export const getRandomMonster = (difficulty) => {
  const monsters = {
    Easy: ['Slime', 'Rat', 'Bat', 'Spider'],
    Medium: ['Goblin', 'Orc', 'Wolf', 'Skeleton'],
    Hard: ['Troll', 'Wyvern', 'Dark Knight', 'Chimera'],
    Epic: ['Dragon', 'Demon Lord', 'Lich King', 'Hydra']
  };

  const pool = monsters[difficulty] || monsters.Medium;
  return pool[Math.floor(Math.random() * pool.length)];
};
