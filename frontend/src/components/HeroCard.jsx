import { Shield, Zap, Crown, Coins } from 'lucide-react';

const HERO_CLASS_COLORS = {
  Mage: 'from-purple-600 to-indigo-600',
  Warrior: 'from-red-600 to-orange-600',
  Rogue: 'from-green-600 to-teal-600',
  Healer: 'from-yellow-600 to-pink-600'
};

const HERO_CLASS_ICONS = {
  Mage: '🔮',
  Warrior: '⚔️',
  Rogue: '🗡️',
  Healer: '✨'
};

const CLASS_BONUSES = {
  Warrior: { label: '+15% Gold per quest', icon: '💰' },
  Mage: { label: '+15% XP per quest', icon: '💜' },
  Rogue: { label: '+5% XP, +10% Gold', icon: '⚡' },
  Healer: { label: '+10% XP, +5% Gold', icon: '✨' }
};

const HeroCard = ({ user }) => {
  const { heroClass = 'Warrior', level = 1, currentXP = 0, maxXP = 100, gold = 0 } = user || {};
  const xpPercentage = (currentXP / maxXP) * 100;
  const classBonus = CLASS_BONUSES[heroClass];

  return (
    <div className={`bg-gradient-to-br ${HERO_CLASS_COLORS[heroClass]} rounded-xl p-6 shadow-2xl border-2 border-opacity-50 border-white`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{HERO_CLASS_ICONS[heroClass]}</div>
          <div>
            <h2 className="text-2xl font-bold text-white font-display">{user?.username || 'Hero'}</h2>
            <p className="text-sm text-white/80">{heroClass}</p>
            <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
              <span>{classBonus.icon}</span>
              <span>{classBonus.label}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
          <Crown size={20} className="text-yellow-400" />
          <span className="text-xl font-bold text-white">Lv. {level}</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/90 mb-1">
          <span className="flex items-center gap-1">
            <Zap size={14} className="text-purple-300" />
            Experience
          </span>
          <span className="font-semibold">{currentXP} / {maxXP} XP</span>
        </div>
        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ease-out"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Gold */}
      <div className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2">
        <span className="text-white/90 text-sm font-medium flex items-center gap-2">
          <Coins size={18} className="text-yellow-400" />
          Gold
        </span>
        <span className="text-2xl font-bold text-yellow-400">{gold}g</span>
      </div>
    </div>
  );
};

export default HeroCard;
