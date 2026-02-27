
// ==========================================

// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getAllSOS()]).then(([s, list]) => {
      setStats(s);
      setSosList(list);
      setLoading(false);
    });
  }, []);

  const STATUS_STYLES = {
    Active: { background: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    Responding: { background: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    Unresponded: { background: 'rgba(239,68,68,0.25)', color: '#FF6B6B' },
  };

  return (
    <div className="page-enter min-h-screen pb-24">
      <div className="glass sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm" onClick={() => navigate('/')}>←</button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--amber)' }}>ADMIN</h1>
          </div>
          <span className="font-mono text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Active SOS', value: stats.activeSOS, icon: '🔴', delta: '+2', color: 'var(--red)' },
                { label: 'Total Today', value: stats.totalToday, icon: '📊', delta: '+5', color: 'var(--amber)' },
                { label: 'Avg Response', value: stats.avgResponseTime, icon: '⚡', delta: '-18s', color: 'var(--green)' },
                { label: 'Resolved', value: stats.resolvedToday, icon: '✅', delta: '+3', color: 'var(--blue)' },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-xs font-mono" style={{ color: stat.color }}>{stat.delta}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Crisis breakdown */}
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">By Crisis Type</p>
              {[['Medical Emergency',10,'#EF4444'],['Accident',7,'#8B5CF6'],['Fire',4,'#F97316'],['Gas Leak',2,'#EAB308'],['Other',1,'#6B7280']].map(([type,count,color]) => (
                <div key={type} className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300">{type}</span>
                    <span className="font-mono" style={{ color }}>{count} ({Math.round(count/24*100)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-4)' }}>
                    <div className="h-full rounded-full" style={{ width: `${count/24*100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* SOS Table */}
            <div className="glass rounded-2xl overflow-hidden mb-4">
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Incidents</p>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      {['ID','Type','Location','Time','Resp.','Status','Action'].map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sosList.map(sos => (
                      <tr key={sos.id}>
                        <td className="font-mono text-xs text-gray-400">{sos.id}</td>
                        <td className="text-xs font-medium">{sos.type}</td>
                        <td className="font-mono text-xs text-gray-500">{sos.location}</td>
                        <td className="font-mono text-xs">{sos.time}</td>
                        <td className="text-green-400 font-medium">{sos.responders}</td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                                style={STATUS_STYLES[sos.status] || STATUS_STYLES.Active}>
                            {sos.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button className="text-xs px-2 py-1 rounded-lg text-green-400"
                                    style={{ background: 'rgba(16,185,129,0.1)' }}
                                    onClick={() => adminService.resolveSOSAdmin(sos.id)}>
                              Resolve
                            </button>
                            <button className="text-xs px-2 py-1 rounded-lg text-red-400"
                                    style={{ background: 'rgba(239,68,68,0.1)' }}
                                    onClick={() => adminService.flagSOS(sos.id)}>
                              Flag
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Response time chart */}
            <div className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Response Time - Last 7 Days (min)</p>
              <div className="flex items-end gap-2 h-24">
                {[4.2,3.8,5.1,3.2,2.9,4.5,3.7].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md"
                         style={{ height: `${(val/6)*100}%`, background: 'linear-gradient(to top, var(--red-dark), var(--red))', minHeight: '8px' }} />
                    <span className="text-xs text-gray-600">{'MTWTFSS'[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default AdminDashboard;


// ==========================================

