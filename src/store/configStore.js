import { createStore, combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

import toggleFavorite from './reducers/favoriteReducer.js';
import openHelpModal from './reducers/openHelpModal.js';

const persistConfig = {
    key: "root",
    storage: AsyncStorage
};

const rootReducer = combineReducers({
    favorites : toggleFavorite,
    aboutModal: openHelpModal
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer);
//onsole.log(store.getState());
let persistor = persistStore(store);

export { store, persistor };