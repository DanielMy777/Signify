import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageGetItem = async (item_id, default_value = null) => {
  let item = await AsyncStorage.getItem(item_id);
  item = item == null ? default_value : JSON.parse(item);
  return item;
};

const AsyncStorageSetItem = (item_id, item_value) => {
  return AsyncStorage.setItem(item_id, JSON.stringify(item_value));
};

export {AsyncStorageGetItem, AsyncStorageSetItem};
