import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Import all pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GIS from './pages/GIS';
import Weather from './pages/Weather';
import Satellite from './pages/Satellite';
import Soil from './pages/Soil';
import Pest from './pages/Pest';
import GovernmentSchemes from './pages/GovernmentSchemes';
import Market from './pages/Market';
import Advisory from './pages/Advisory';

// Import Global Components
import Chatbot from './components/Chatbot';
import ProfileModal from './components/ProfileModal';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/gis" element={<GIS />} />
            <Route path="/dashboard/weather" element={<Weather />} />
            <Route path="/dashboard/satellite" element={<Satellite />} />
            <Route path="/dashboard/soil" element={<Soil />} />
            <Route path="/dashboard/pest" element={<Pest />} />
            <Route path="/dashboard/schemes" element={<GovernmentSchemes />} />
            <Route path="/dashboard/market" element={<Market />} />
            <Route path="/dashboard/advisory" element={<Advisory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Persistent AI Decision Support Chatbot in right corner */}
          <Chatbot />

          {/* Global User Profile Modal */}
          <ProfileModal />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
