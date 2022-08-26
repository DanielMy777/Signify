import React, {useEffect, useState} from 'react';
const AppContext = React.createContext();
import {AsyncStorageGetItem, AsyncStorageSetItem} from '../Utils/async-storage';
const heabrewEanbledItem = 'heabrewEnabled';
const learningSoundEffectsItem = 'learningsoundeffects';
const learnedSignWordsItem = 'learnedsignwords';

const AppProvider = ({children}) => {
  const [signWordsLearned, setSignWordsLearned] = useState({});
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
      setSignWordsLearned(await AsyncStorageGetItem(learnedSignWordsItem, {}));
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
      AsyncStorageSetItem(learnedSignWordsItem, signWordsLearned);
    }
  }, [
    heabrewDetectionEnabled,
    learningSoundEffectsEnabled,
    signWordsLearned,
    loaded,
  ]);

  return (
    <AppContext.Provider
      value={{
        heabrewDetectionEnabled,
        setHeabrewDetectionEnabled,
        learningSoundEffectsEnabled,
        setLearningSoundEffectsEnabled,
        signWordsLearned,
        setSignWordsLearned,
      }}>
      {children}
    </AppContext.Provider>
  );
};

module.exports = {
  AppContext,
  AppProvider,
};
