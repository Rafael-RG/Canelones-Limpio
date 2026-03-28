import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);

  const startSession = (collector, vehicle, session) => {
    setActiveSession({ collector, vehicle, session });
  };

  const endSession = () => {
    setActiveSession(null);
  };

  return (
    <SessionContext.Provider value={{ activeSession, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};
