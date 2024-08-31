import React, { createContext, useState, useContext } from 'react';

export const AlertContext = createContext(); // Export the context

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prevAlerts => [...prevAlerts, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};