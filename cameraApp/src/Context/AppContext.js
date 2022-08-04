import React, {useEffect, useState} from 'react';
const AppContext = React.createContext();
import {AsyncStorageGetItem, AsyncStorageSetItem} from '../Utils/async-storage';
const heabrewEanbledItem = 'heabrewEnabled';
const learningSoundEffectsItem = 'learningsoundeffects';

const AppProvider = ({children}) => {
  const [heabrewDetectionEnabled, setHeabrewDetectionEnabled] = useState(false);
  const [learningSoundEffectsEnabled, setLearningSoundEffectsEnabled] =
    useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLearningSoundEffectsEnabled(
        await AsyncStorageGetItem(learningSoundEffectsItem, true),
      );
      setHeabrewDetectionEnabled(
        await AsyncStorageGetItem(heabrewEanbledItem, false),
      );
      setLoaded(true);
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorageSetItem(heabrewEanbledItem, heabrewDetectionEnabled);
      AsyncStorageSetItem(
        learningSoundEffectsItem,
        learningSoundEffectsEnabled,
      );
    }
  }, [heabrewDetectionEnabled, learningSoundEffectsEnabled, loaded]);

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
