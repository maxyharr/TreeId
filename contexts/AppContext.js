import React from 'react';
import api from '../api';

const AppContext = React.createContext();

export const useApi = () => {
  return React.useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{ api }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
