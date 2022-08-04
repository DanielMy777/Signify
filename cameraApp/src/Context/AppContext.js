import React, {useState} from 'react';

const AppContext = React.createContext();

const AppProvider = ({children}) => {
  const [heabrewDetectionEnabled, setHeabrewDetectionEnabled] = useState(false);
  const [learningSoundEffectsEnabled, setLearningSoundEffectsEnabled] =
    useState(true);
  return (
    <AppContext.Provider
      value={{
        heabrewDetectionEnabled,
        setHeabrewDetectionEnabled,
        learningSoundEffectsEnabled,
        setLearningSoundEffectsEnabled,
      }}>
      {children}
    </AppContext.Provider>
  );
};

module.exports = {
  AppContext,
  AppProvider,
};
