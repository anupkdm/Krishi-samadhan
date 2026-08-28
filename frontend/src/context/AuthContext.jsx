import React, { createContext, useContext, useState, useEffect } from 'react';
import { AVAILABLE_LOCATIONS, DEFAULT_LOCATION, getUserLocation } from '../config/locations';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeLocation, setActiveLocation] = useState(() => getUserLocation());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync user changes from localStorage if any
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
        setActiveLocation(getUserLocation());
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    if (userData?.location) {
      const locKey = Object.keys(AVAILABLE_LOCATIONS).find(k =>
        userData.location.toLowerCase().includes(k.toLowerCase())
      );
      if (locKey && AVAILABLE_LOCATIONS[locKey]) {
        localStorage.setItem('activeLocation', locKey);
        setActiveLocation(AVAILABLE_LOCATIONS[locKey]);
      }
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileModalOpen(false);
  };

  const changeActiveLocation = (locationKeyOrObject) => {
    let key = typeof locationKeyOrObject === 'string' ? locationKeyOrObject : null;
    if (!key && locationKeyOrObject && locationKeyOrObject.name) {
      key = Object.keys(AVAILABLE_LOCATIONS).find(k => AVAILABLE_LOCATIONS[k].name === locationKeyOrObject.name);
    }
    if (key && AVAILABLE_LOCATIONS[key]) {
      localStorage.setItem('activeLocation', key);
      setActiveLocation(AVAILABLE_LOCATIONS[key]);

      // If logged in, also update user's location in localStorage
      if (user) {
        const updated = { ...user, location: `${key}, Maharashtra` };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
      }
    } else if (locationKeyOrObject && typeof locationKeyOrObject === 'object' && locationKeyOrObject.latitude && locationKeyOrObject.longitude) {
      setActiveLocation(locationKeyOrObject);
    }
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      activeLocation,
      isProfileModalOpen,
      openProfileModal,
      closeProfileModal,
      loginUser,
      logoutUser,
      changeActiveLocation,
      setCustomLocation: changeActiveLocation,
      availableLocations: AVAILABLE_LOCATIONS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
