import React from 'react';

const badges = [
  { id: 'first-game', label: 'First Game Played', icon: '🏅', description: 'Played your first game!' },
  { id: 'streak-5', label: '5-Day Streak', icon: '🔥', description: 'Used the dashboard 5 days in a row!' },
  { id: 'quiz-master', label: 'Quiz Master', icon: '🧠', description: 'Scored 10/10 in Math Quiz!' },
];

const AchievementBadges = ({ user1, user2 }) => (
  <div className="flex gap-8 flex-wrap">
    {/* User 1 Badges */}
    <div>
      <div className="font-bold text-lg mb-2 text-blue-600">{user1.name || "User 1"}</div>
      <div className="flex gap-4 flex-wrap">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl shadow-lg border transition-all duration-500
              ${user1.unlocked.includes(badge.id)
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-bounce'
                : 'bg-gray-700 text-gray-400 opacity-50'
              }`}
            title={badge.description}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="font-bold">{badge.label}</div>
          </div>
        ))}
      </div>
    </div>
    {/* User 2 Badges */}
    <div>
      <div className="font-bold text-lg mb-2 text-green-600">{user2.name || "User 2"}</div>
      <div className="flex gap-4 flex-wrap">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl shadow-lg border transition-all duration-500
              ${user2.unlocked.includes(badge.id)
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-bounce'
                : 'bg-gray-700 text-gray-400 opacity-50'
              }`}
            title={badge.description}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="font-bold">{badge.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AchievementBadges;

/* Usage Example:
<AchievementBadges
  user1={{ name: "Alice", unlocked: ["first-game", "streak-5"] }}
  user2={{ name: "Bob", unlocked: ["first-game", "quiz-master"] }}
/>
*/