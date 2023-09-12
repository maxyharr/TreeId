import React from 'react';
import api from '../api';
import trefleApi from '../trefleApi';

const AppContext = React.createContext();

export const useApi = () => {
  return React.useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{ api, trefleApi }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
