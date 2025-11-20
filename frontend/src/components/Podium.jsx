import { Trophy, Medal, Award } from 'lucide-react';

const Podium = ({ topThree, showFocusTime }) => {
  const getPodiumHeight = (rank) => {
    switch (rank) {
      case 1:
        return 'h-48';
      case 2:
        return 'h-36';
      case 3:
        return 'h-28';
      default:
        return 'h-24';
    }
  };

  const getPodiumIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={32} className="text-yellow-400" />;
      case 2:
        return <Medal size={28} className="text-slate-300" />;
      case 3:
        return <Award size={28} className="text-amber-600" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-t from-yellow-900/40 to-yellow-800/20 border-yellow-700';
      case 2:
        return 'bg-gradient-to-t from-slate-800/40 to-slate-700/20 border-slate-600';
      case 3:
        return 'bg-gradient-to-t from-amber-900/40 to-amber-800/20 border-amber-700';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  if (!topThree || topThree.length === 0) {
    return (
      <div className="text-center text-slate-400 py-12">
        No leaderboard data yet. Start completing sessions!
      </div>
    );
  }

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="flex items-end justify-center gap-8 mb-8 px-6">
      {podiumOrder.map((user, index) => {
        const actualRank = user.rank;
        return (
          <div key={user.username} className="flex flex-col items-center w-32">
            {/* User Info */}
            <div className="mb-4 flex flex-col items-center w-full">
              <div className="mb-2">
                {getPodiumIcon(actualRank)}
              </div>
              <div className="text-white font-semibold text-center w-full truncate px-2">
                {user.username}
              </div>
              <div className="text-emerald-400 text-sm font-semibold mt-1 text-center w-full">
                {showFocusTime ? (
                  `${Math.floor(user.totalDuration / 60)}h ${Math.round(user.totalDuration % 60)}m`
                ) : (
                  `${user.currentStreak} day${user.currentStreak !== 1 ? 's' : ''}`
                )}
              </div>
              {user.isCurrentUser && (
                <div className="text-xs text-emerald-500 mt-1 text-center w-full">You</div>
              )}
            </div>

            {/* Podium */}
            <div
              className={`w-full ${getPodiumHeight(actualRank)} ${getBackgroundColor(
                actualRank
              )} border-2 rounded-t-lg flex items-center justify-center transition-all hover:scale-105`}
            >
              <div className="text-2xl font-bold text-white">#{actualRank}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Podium;
