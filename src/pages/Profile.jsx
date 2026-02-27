

// ==========================================

// src/pages/Profile.jsx
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import Navbar from '../components/shared/Navbar';

const ALL_SKILLS = ['CPR', 'Doctor', 'Nurse', 'Electrician', 'Mechanic', 'First Aid', 'Firefighter'];
const SKILL_ICONS = { 'CPR': '❤️', 'Doctor': '👨‍⚕️', 'Nurse': '👩‍⚕️', 'Electrician': '⚡', 'Mechanic': '🔧', 'First Aid': '🩹', 'Firefighter': '🔥' };

const Profile = () => {
  const navigate = useNavigate();
  const { name, skills, toggleSkill, rating, totalResponses } = useUserStore();

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px' }}>MY PROFILE</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Profile card */}
        <div className="glass rounded-2xl p-5 mb-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold mx-auto mb-3">{name[0]}</div>
          <h2 className="font-bold text-lg">{name}</h2>
          <p className="text-sm text-gray-500 mb-3">Community Responder</p>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map(skill => (
              <span key={skill} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[[totalResponses, 'Responses'], [8, 'Resolved'], [`${rating}⭐`, 'Rating']].map(([val, label]) => (
            <div key={label} className="stat-card text-center">
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Skill Registry */}
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Skill Registry</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_SKILLS.map(skill => {
              const has = skills.includes(skill);
              return (
                <button key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-left transition-all border ${has ? 'text-red-300' : 'text-gray-400'}`}
                  style={{ borderColor: has ? 'rgba(255,45,32,0.4)' : 'var(--border)', background: has ? 'rgba(255,45,32,0.08)' : 'var(--surface-3)' }}>
                  <span>{SKILL_ICONS[skill]}</span>
                  {skill}
                  {has && <span className="ml-auto text-red-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;

