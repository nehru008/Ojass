// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SOSBroadcast from './pages/SOSBroadcast';
import LiveMapView from './pages/LiveMapView';
import ResponderView from './pages/ResponderView';
import ChatView from './pages/ChatView';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

/**
 * App.jsx - Root router setup
 * All routes are mobile-first, wrapped in BrowserRouter
 */
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sos" element={<SOSBroadcast />} />
      <Route path="/map" element={<LiveMapView />} />
      <Route path="/responder" element={<ResponderView />} />
      <Route path="/chat" element={<ChatView />} />
      <Route path="/ai" element={<AIAssistant />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
